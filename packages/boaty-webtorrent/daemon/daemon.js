const WebTorrent = require('webtorrent')
const EventEmitter = require('events')
const Rx = require('rxjs')
const p = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

class Daemon extends EventEmitter {
  constructor(config, options = {}) {
    super()

    this.options = Object.assign({ duration: 1000 }, options)
    this.config = config
    this.events = ['infoHash', 'metadata', 'ready', 'warning', 'error', 'done', 'download', 'upload', 'wire', 'noPeers']
    this.garbages = {}
    this.paths = {
      store: p.resolve(__dirname, 'store'),
      watch: this.config['watch-dir'],
      download: this.config['download-dir']
    }

    this.client = new WebTorrent()
    this.client.on('error', e => this.emit('error', 'WebTorrent/boaty', e))

    fs.readdir(this.paths.store, (e, files) => files
      .filter(filename => p.extname(filename) === '.torrent')
      .map(filename => p.resolve(this.paths.store, filename))
      .forEach(path => this.handle(path))
    )

    fs.readdir(this.paths.watch, (e, files) => files
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

  drain(path) {
    const copy = p.resolve(this.paths.store, p.basename(path))

    if (fs.existsSync(path) && !fs.existsSync(copy)) {
      fs.copyFile(path, copy, () => {
        if (this.config['watch-delete']) {
          rimraf(path, { glob: false }, (e) => e && this.emit('error', 'WebTorrent/boaty/drain/delete', e))
        }

        this.handle(copy)
      })
    }
  }

  handle(uri) {
    const torrent = this.client.add(uri, { path: this.paths.download })
    torrent.on('ready', () => {
      this.emit('handling', torrent)

      Rx.Observable
        .merge(...this.events.map(event => Rx.Observable.fromEvent(torrent, event)))
        .auditTime(this.options.duration)
        .map(() => this.diff(torrent))
        .filter(differencies => differencies)
        .subscribe(differencies => this.emit('amend', differencies))
    })
  }

  stats() {
    return {
      down: this.client.downloadSpeed,
      up: this.client.uploadSpeed,
      ratio: this.client.ratio,
    }
  }

  shape(payload) {
    return {
      hash: payload.infoHash,
      name: payload.name,
      announce: payload.announce,
      path: payload.path,
      created: payload.created,
      paused: payload.paused,
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

  all(shape = false, ready = false) {
    return this.client.torrents.filter(torrent => !ready || torrent.ready).map(shape ? this.shape : v => v)
  }

  get(hash, shape = false, ready = false) {
    return this.client.torrents.filter(torrent => (!ready || torrent.ready) && torrent.infoHash === hash).map(shape ? this.shape : v => v).pop()
  }

  diff(torrent) {
    const next = this.get(torrent.infoHash, true)
    const previous = this.garbages[torrent.infoHash] || {}
    const clone = { hash: torrent.infoHash }

    for (let key in next) {
      if (['string', 'number', 'boolean'].includes(typeof next[key]) && next[key] !== previous[key]) {
        clone[key] = next[key]
      } else if (Array.isArray(next[key]) && (next[key].length !== (previous[key] || []).length || !next[key].every((v, i) => v === previous[key][i]))) {
        clone[key] = next[key]
      }
    }

    this.garbages[torrent.infoHash] = next
    return Object.keys(clone).length > 1 ? clone : null
  }
}

module.exports = Daemon
