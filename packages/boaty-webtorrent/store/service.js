import WebSocket from 'ws'

const PORT = 9876
const router = new Map()
const wsc = new WebSocket(`ws://localhost:${PORT}`)
let id = 0

wsc.on('message', payload => {
  const data = decode(payload)
  router.get(data.id)(data)
})

const webtorrent = {
  torrents: async () => {
    const current = ++id
    await open(wsc)
    wsc.send(encode(current, 'TORRENTS'))
    return route(current, data => data.result.torrents)
  }
}

async function open(wsc) {
  return new Promise((resolve, reject) => {
    if (wsc.readyState === WebSocket.OPEN) {
      resolve()
    } else {
      wsc.on('open', () => resolve())
      wsc.on('error', e => reject(e))
    }
  })
}

function route(id, transform = d => d) {
  return new Promise((resolve, reject) => {
    router.set(id, data => {
      router.delete(id)

      if (data.failure === 1) {
        reject(data.message)
      } else {
        resolve(transform(data))
      }
    })
  })
}

function encode(id, method, params = {}) {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method,
    params,
  })
}

function decode(payload) {
  return JSON.parse(payload)
}

export default webtorrent
