#!/usr/bin/env node
const WebTorrent = require('webtorrent')
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')
const logger = require('@studio/log')
const fancy = require('@studio/log/format/fancy')
const torrents = require('./torrents.json')

const PORT = 9876

const debugfile = fs.createWriteStream(path.join(__dirname, 'debug.log'))
const argv = require('minimist')(process.argv.slice(2))

logger.transform(fancy()).out(argv.quiet ? debugfile : process.stdout)

const loggers = {
  webtorrent: logger('[WebTorrent]'),
  daemon: logger('[Daemon]'),
  socket: logger('[Socket]'),
}

loggers.webtorrent.launch('Booting...')
const wtc = new WebTorrent()

torrents.forEach(torrent => {
  loggers.webtorrent.spawn('Loading', `${torrent.type === 'fs' ? path.basename(torrent.uri) : torrent.uri}`)
  wtc.add(torrent.uri)
})

loggers.webtorrent.finish('Booted !')

loggers.daemon.launch('Booting...')
const wss = new WebSocket.Server({ port: PORT })
loggers.daemon.finish('Booted !')

wss.on('connection', (ws) => {
  loggers.socket.fetch('Connected !')

  ws.on('message', payload => {
    const data = decode(payload)
    let response
    loggers.socket.input(data.method || 'UNKNOWN', data)

    switch (data.method) {
      case 'TORRENT':
      break
      case 'RESUME':
      break
      case 'PAUSE':
      break
      case 'TORRENTS':
        const torrents = wtc.torrents.map(torrent => ({
          hash: torrent.infoHash,
          name: torrent.name,
          announce: torrent.announce,
          path: torrent.path,
          created: torrent.created,
          paused: torrent.paused,
          done: torrent.done,
          timeRemaining: torrent.timeRemaining,
          total: torrent.length,
          downloaded: torrent.downloaded,
          uploaded: torrent.uploaded,
          downloadSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
          progress: torrent.progress,
          ratio: torrent.ratio,
          peers: torrent.numPeers,
          files: torrent.files.map(file => file.path),
          pieces: torrent.pieces.map(piece => (piece === null || piece.missing === 0) ? 1 : (piece.ongoing < piece.length ? 0 : -1)),
        }))

        response = { torrents }
      break
    }

    if (response) {
      loggers.socket.output(data.method, response)
      ws.send(encode(data.id, data.method, response))
    }
  })
})

function encode(id, method, result = {}) {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method,
    result,
  })
}

function decode(payload) {
  return JSON.parse(payload)
}
