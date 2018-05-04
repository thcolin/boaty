#!/usr/bin/env node
const PORT = 9876
const WebSocket = require('ws')
const Rx = require('rxjs')

const argv = require('minimist')(process.argv.slice(2))
const loggers = require('./loggers')(argv)

loggers.daemon.timing('Booting...')
const config = require('../../../config.json')['@boaty/webtorrent']
const daemon = new (require('./daemon'))(config)
daemon.on('handling', (torrent) => loggers.daemon.spawn('Handling', torrent.name))
daemon.on('error', (type, e) => loggers.daemon.error('Error', type, e))
loggers.daemon.launch('Ready !')

loggers.socket.timing('Booting...')
const socket = new WebSocket.Server({ port: PORT })
const transport = require('./transport')
const actions = require('../actions')
loggers.socket.launch('Ready !')

socket.on('connection', (client) => {
  loggers.socket.fetch('Connected !')

  const dispatch = (feedback) => client.readyState === WebSocket.OPEN && client.send(transport.encode(feedback))
  const close$ = new Rx.Subject()

  client.on('close', () => {
    loggers.socket.terminate('Disconnected !')
    close$.next(true)
  })

  client.on('message', payload => {
    const action = transport.decode(payload)
    loggers.socket.input(action.type, action)

    switch (action.type) {
      case actions.OBSERVE_STATS: {
        let memory = {}

        Rx.Observable
          .timer(0, 5000)
          .map(() => daemon.stats())
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
        const feedback = actions.fillTorrents(daemon.all(true, true))
        dispatch(feedback)
        loggers.socket.output(feedback.type)
        break
      }

      case actions.OBSERVE_TORRENTS: {
        Rx.Observable.fromEvent(daemon, 'handling')
          .takeUntil(close$)
          .subscribe(torrent => {
            const feedback = actions.enhanceTorrents(daemon.shape(torrent))
            dispatch(feedback)
            loggers.socket.output(feedback.type, torrent.name)
          })

        Rx.Observable.fromEvent(daemon, 'truncate')
          .takeUntil(close$)
          .subscribe(hash => {
            const feedback = actions.truncateTorrents(hash)
            dispatch(feedback)
            loggers.socket.output(feedback.type, hash)
          })

        Rx.Observable.fromEvent(daemon, 'amend')
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

      case actions.PAUSE_TORRENT: {
        daemon.pause(action.hash)
        break
      }

      case actions.RESUME_TORRENT: {
        daemon.resume(action.hash)
        break
      }

      case actions.REMOVE_TORRENT: {
        daemon.remove(action.hash)
        break
      }

      case actions.DELETE_TORRENT: {
        daemon.delete(action.hash)
        break
      }
    }
  })
})
