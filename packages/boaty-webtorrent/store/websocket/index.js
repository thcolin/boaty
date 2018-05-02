import WebSocket from 'ws'
import Client from '@boaty/webtorrent/store/websocket/client'
import Rx from 'rxjs'
import * as paneDuck from '@boaty/webtorrent/store/ducks/pane'
import logger from '@boaty/boat/utils/logger'

const PORT = 9876
const URI = `ws://localhost:${PORT}`
const subject$ = new Rx.Subject()
const client = new Client()
const websocket = {
  connect: () => subject$,
  dispatch: async (action) => {
    try {
      await wait(client)
      client.send(encode(action))
  	} catch (e) {
  		return websocket.dispatch(action)
  	}
  }
}

client.open(URI)
client.on('message', (payload) => subject$.next(decode(payload)))

client.on('open', () => {
  logger.fetch('WebTorrent')
  subject$.next(paneDuck.successSocket())
})

client.on('close', () => {
  logger.terminate('WebTorrent')
  subject$.next(paneDuck.failureSocket())
})

async function wait(client) {
  return new Promise((resolve, reject) => {
    if (client.instance.readyState === WebSocket.OPEN) {
      resolve()
    } else {
      client.once('open', resolve)
      client.once('error', reject)
    }
  })
}

function encode(action = { type: 'undefined' }) {
  return JSON.stringify(action)
}

function decode(payload) {
  return JSON.parse(payload)
}

export default websocket
