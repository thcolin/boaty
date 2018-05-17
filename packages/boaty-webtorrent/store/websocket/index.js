import WebSocket from 'ws'
import Client from '@boaty/webtorrent/store/websocket/client'
import Rx from 'rxjs'
import * as websocketDuck from '@boaty/webtorrent/store/ducks/websocket'
import connection from '@boaty/webtorrent/utils/connection'
import logger from '@boaty/boat/utils/logger'

const URI = `ws://${connection.host}:${connection.port}`
const subject$ = new Rx.Subject()
const client = new Client()
const websocket = {
  connect: () => subject$,
  dispatch: async (message) => {
    try {
      await wait(client)
      client.send(encode(message))
  	} catch (e) {
  		return websocket.dispatch(message)
  	}
  }
}

client.open(URI)
client.on('message', (payload) => subject$.next(decode(payload)))

client.on('open', () => {
  logger.fetch('WebTorrent')
  subject$.next(websocketDuck.successWebsocket())
})

client.on('close', () => {
  logger.terminate('WebTorrent')
  subject$.next(websocketDuck.failureWebsocket())
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
