#!/usr/bin/env node
const PORT = 9876
const WebSocket = require('ws')
const Rx = require('rxjs')

const argv = require('minimist')(process.argv.slice(2))
const loggers = require('./loggers')(argv)

loggers.webtorrent.launch('Booting...')
const client = require('./client')
const store = require('./store.json')

store.forEach(row => loggers.webtorrent.spawn('Loading', row.name))
client.bootstrap(store)

const server = new WebSocket.Server({ port: PORT })
const transport = require('./transport')
const actions = require('../actions')
loggers.webtorrent.finish('Booted !')

server.on('connection', (socket) => {
  loggers.socket.fetch('Connected !')

  const dispatch = (feedback) => socket.readyState === WebSocket.OPEN && socket.send(transport.encode(feedback))
  const close$ = new Rx.Subject()

  socket.on('close', () => {
    loggers.socket.terminate('Disconnected !')
    close$.next(true)
  })

  socket.on('message', payload => {
    const action = transport.decode(payload)
    loggers.socket.input(action.type, action)

    switch (action.type) {
      case actions.OBSERVE_STATS: {
        let memory = {}

        Rx.Observable
          .timer(0, 5000)
          .map(() => client.stats())
          .filter(stats => !Object.keys(stats).every(key => stats[key] === memory[key]))
          .do(stats => memory = stats)
          .takeUntil(close$)
          .subscribe((stats) => {
            const feedback = actions.fillStats(stats)
            dispatch(feedback)
            loggers.socket.output(feedback.type, Object.keys(feedback.stats))
          })
        break
      }

      case actions.FETCH_TORRENTS: {
        const feedback = actions.fillTorrents(client.all())
        dispatch(feedback)
        loggers.socket.output(feedback.type)
        break
      }

      case actions.OBSERVE_TORRENTS: {
        Rx.Observable.merge(...client.all(true).map(torrent => client.listen(torrent.infoHash, 1000)))
          .takeUntil(close$)
          .bufferTime(1000)
          .filter(group => group.length)
          .subscribe((group) => {
            const feedback = actions.amendTorrents(group)
            dispatch(feedback)
            loggers.socket.output(feedback.type, group.length)
          })
        break
      }
    }
  })
})
