import WebSocket from 'ws'

function Client() {
  this.listeners = {
    open: [],
    message: [],
    close: [],
    error: [],
  }
}

Client.prototype.open = function(uri, interval = 5000) {
  this.uri = uri
	this.interval = interval
	this.instance = new WebSocket(this.uri)

	this.instance.on('open', () => this.proceed('open', []))
	this.instance.on('message', (data, flags) => this.proceed('message', [data]))

	this.instance.on('close', (e) => {
    this.proceed('close')
		switch (e.code) {
  		case 1000:
			break
  		default:
  			this.reconnect(e)
			break
		}
	})

	this.instance.on('error', (e) => {
		switch (e.code) {
  		case 'ECONNREFUSED':
  			this.reconnect(e)
			break
  		default:
        this.proceed('error', [e])
			break
		}
	})
}

Client.prototype.send = function(data, option) {
	try {
		this.instance.send(data, option)
	} catch (e) {
		this.instance.emit('error', e)
	}
}

Client.prototype.reconnect = function(e) {
  this.instance.removeAllListeners()
	setTimeout(() => this.open(this.uri), this.interval)
}

Client.prototype.proceed = function(type, args = []) {
  this.listeners[type].forEach(callback => callback(...args))
}

Client.prototype.on = function(type, callback) {
  this.listeners[type].push(callback)
}

Client.prototype.once = function(type, callback) {
  const index = this.listeners[type].push(() => {
    callback()
    this.listeners[type].splice(1, index - 1)
  })
}

export default Client
