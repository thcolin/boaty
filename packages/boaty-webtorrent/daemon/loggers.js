const fs = require('fs')
const path = require('path')
const logger = require('@studio/log')
const fancy = require('@studio/log/format/fancy')

module.exports = (argv) => {
  const debugfile = fs.createWriteStream(path.join(__dirname, 'debug.log'))
  logger.transform(fancy()).out(argv.quiet ? debugfile : process.stdout)

  return {
    daemon: logger('daemon'),
    socket: logger('socket'),
  }
}
