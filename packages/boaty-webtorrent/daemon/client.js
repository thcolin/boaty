const WebTorrent = require('webtorrent')
const Rx = require('rxjs')
const shapers = require('./shapers')

const webtorrent = new WebTorrent()
const events = ['infoHash', 'metadata', 'ready', 'warning', 'error', 'done', 'download', 'upload', 'wire', 'noPeers']
const garbages = {}

function shape(payload) {
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

function bootstrap(store) {
  store.forEach(row => {
    webtorrent.add(row.uri)
  })
}

function stats() {
  return {
    down: webtorrent.downloadSpeed,
    up: webtorrent.uploadSpeed,
    ratio: webtorrent.ratio,
  }
}

function all(original = false) {
  return webtorrent.torrents.map(original ? v => v : shapers.torrent)
}

function get(hash, original = false) {
  return webtorrent.torrents.filter(torrent => torrent.infoHash === hash).map(original ? v => v : shapers.torrent).pop()
}

function diff(torrent) {
  const next = get(torrent.infoHash)
  const previous = garbages[torrent.infoHash] || {}
  const clone = { hash: torrent.infoHash }

  for (let key in next) {
    if (['string', 'number', 'boolean'].includes(typeof next[key]) && next[key] !== previous[key]) {
      clone[key] = next[key]
    } else if (Array.isArray(next[key]) && (next[key].length !== (previous[key] || []).length || !next[key].every((v, i) => v === previous[key][i]))) {
      clone[key] = next[key]
    }
  }

  garbages[torrent.infoHash] = next
  return Object.keys(clone).length > 1 ? clone : null
}

function listen(hash, duration = 1000) {
  const torrent = get(hash, true)

  return Rx.Observable
    .merge(...events.map(event => Rx.Observable.fromEvent(torrent, event)))
    .auditTime(duration)
    .map(() => diff(torrent))
    .filter(differencies => differencies)
}

module.exports = {
  bootstrap,
  stats,
  all,
  get,
  listen,
}
