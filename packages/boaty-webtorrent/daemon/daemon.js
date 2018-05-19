const WebTorrent = require('webtorrent')
const parseTorrent = require('parse-torrent')
const EventEmitter = require('events')
const Rx = require('rxjs')
const p = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

class Daemon extends EventEmitter {
  constructor(config, options = {}) {
    super()

    this.options = Object.assign({ duration: 1000 }, options)
    this.config = config
    this.events = ['infoHash', 'metadata', 'ready', 'warning', 'error', 'done', 'download', 'upload', 'wire', 'noPeers', 'idle', 'close']
    this.sideline = {}
    this.garbages = {}
    this.paths = {
      store: p.resolve(__dirname, 'store'),
      trash: p.resolve(__dirname, 'trash'),
      watch: this.config['watch-dir'],
      download: this.config['download-dir']
    }

    this.client = new WebTorrent()
    this.client.on('error', e => this.emit('error', e))

    process.umask(0)
    mkdirp.sync(this.paths.store)
    mkdirp.sync(this.paths.trash)

    fs.access(this.paths.download, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,
      (err) => err && this.emit('error', err)
    )

    fs.readdir(this.paths.store, (e, files) => (files || [])
      .filter(filename => p.extname(filename) === '.torrent')
      .map(filename => p.resolve(this.paths.store, filename))
      .forEach(path => this.handle(path))
    )

    fs.readdir(this.paths.watch, (e, files) => (files || [])
      .filter(filename => p.extname(filename) === '.torrent')
      .map(filename => p.resolve(this.paths.watch, filename))
      .forEach(path => this.drain(path))
    )

    this.watcher = fs.watch(this.paths.watch, {}, (type, filename) => {
      if (type !== 'change' && p.extname(filename) === '.torrent') {
        this.drain(p.resolve(this.paths.watch, filename))
      }
    })
  }

  import(payload) {
    const buffer = Buffer.from(payload)

    try {
      const torrent = parseTorrent(buffer)
      const path = p.resolve(this.paths.store, `${torrent.name || torrent.infoHash}.torrent`)

      if (!fs.existsSync(path)) {
        fs.writeFile(path, buffer, (err) => err ? this.emit('error', err) : this.handle(path))
      }
    } catch (e) {
      this.emit('error', e)
    }
  }

  drain(path) {
    const copy = p.resolve(this.paths.store, p.basename(path))

    if (fs.existsSync(path) && !fs.existsSync(copy)) {
      fs.copyFile(path, copy, (err) => {
        if (err) {
          this.emit('error', err)
        } else {
          if (this.config['watch-delete']) {
            rimraf(path, { glob: false }, (e) => e && this.emit('error', e))
          }

          this.handle(copy)
        }
      })
    }
  }

  handle(uri, retry = true) {
    const fresh = this.all(true).every(torrent => torrent.uri !== uri)
    const torrent = this.client.add(uri, { path: this.paths.download })

    torrent.uri = uri

    Rx.Observable
      .merge(
        ...this.events.map(event =>
          Rx.Observable
            .fromEvent(torrent, event)
            .map(value => ({ type: event, value: value }))
            .do(e => {
              switch (e.type) {
                case 'metadata':
                  if (fresh) {
                    this.emit('handling', torrent)
                  }

                  this.emit('amend', this.diff(torrent.infoHash))
                  break
                case 'ready':
                  this.emit('amend', this.diff(torrent.infoHash))
                  break
                case 'warning':
                  this.emit('error', Object.assign({ name: torrent.name || torrent.infoHash }, e))
                  break
                case 'error':
                  this.emit('error', Object.assign({ name: torrent.name || torrent.infoHash }, e))

                  if (retry) {
                    this.handle(uri, false)
                  }
              }
            })
        ),
        Rx.Observable
          .timer(0, 5000)
          .mapTo({ type: 'refresh' })
          .takeUntil(Rx.Observable.merge(...['ready', 'done', 'close'].map(event => Rx.Observable.fromEvent(torrent, event))))
      )
      .auditTime(this.options.duration)
      .map(() => this.diff(torrent.infoHash))
      .filter(differencies => differencies)
      .subscribe(differencies => this.emit('amend', differencies))
  }

  stats() {
    return {
      down: this.client.downloadSpeed,
      up: this.client.uploadSpeed,
      ratio: this.client.ratio,
      total: this.all(true).length,
      done: this.all(true).filter(torrent => torrent.done).length
    }
  }

  shape(payload) {
    return {
      hash: payload.infoHash,
      uri: payload.uri,
      name: payload.name || payload.infoHash,
      announce: payload.announce,
      path: payload.path,
      created: payload.created,
      stoped: !!payload.stoped,
      done: payload.done,
      timeRemaining: payload.timeRemaining,
      total: payload.length,
      downloaded: payload.downloaded,
      uploaded: payload.uploaded,
      downloadSpeed: payload.downloadSpeed,
      uploadSpeed: payload.uploadSpeed,
      progress: payload.progress,
      ratio: payload.ratio,
      peers: payload.numPeers,
      files: payload.files.map(file => file.path),
      pieces: payload.pieces.map(piece => (piece === null || piece.missing === 0) ? 1 : (piece.ongoing < piece.length ? 0 : -1)),
    }
  }

  all(shape = false) {
    return this.client.torrents
      .map(shape ? this.shape : v => v)
      .concat(shape ? Object.values(this.sideline) : [])
  }

  get(hash, shape = false) {
    return this.all(shape)
      .filter(torrent => torrent[shape ? 'hash' : 'infoHash'] === hash)
      .pop()
  }

  pause(hash) {
    const torrent = this.get(hash, true)

    if (torrent) {
      torrent.stoped = true
      this.sideline[hash] = torrent
      this.emit('amend', this.diff(hash))
      this.client.remove(hash)
    }

    return torrent
  }

  resume(hash) {
    const torrent = this.get(hash, true)

    if (torrent) {
      this.handle(torrent.uri)
      delete this.sideline[hash]
    }

    return torrent
  }

  remove(hash) {
    const torrent = this.get(hash, true)

    if (torrent) {
      if (fs.existsSync(torrent.uri)) {
        fs.copyFile(torrent.uri, p.resolve(this.paths.trash, p.basename(torrent.uri)), () => {
          rimraf(torrent.uri, { glob: false }, (e) => e && this.emit('error', e))
        })
      }

      try {
        this.client.remove(hash)
        this.emit('truncate', hash)
      } catch (e) {
        delete this.sideline[hash]
        this.emit('truncate', hash)
      }
    }

    return torrent
  }

  delete(hash) {
    const torrent = this.remove(hash)
    const path = torrent ? p.resolve(torrent.path, torrent.files[0].split(p.sep).shift()) : null

    if (torrent && path && fs.existsSync(path) && path !== p.resolve(this.paths.download)) {
      this.emit('delete', path)
      rimraf(path, { glob: false }, (e) => e && this.emit('error', e))
    }

    return torrent
  }

  diff(hash) {
    const next = this.get(hash, true)
    const previous = this.garbages[hash] || {}
    const clone = { hash: hash }

    for (let key in next) {
      if (['string', 'number', 'boolean'].includes(typeof next[key]) && next[key] !== previous[key]) {
        clone[key] = next[key]
      } else if (Array.isArray(next[key]) && (next[key].length !== (previous[key] || []).length || !next[key].every((v, i) => v === previous[key][i]))) {
        clone[key] = next[key]
      }
    }

    this.garbages[hash] = next
    return Object.keys(clone).length > 1 ? clone : null
  }
}

module.exports = Daemon
