module.exports = (payload) => ({
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
})