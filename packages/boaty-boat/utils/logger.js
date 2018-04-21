import fs from 'fs'
import path from 'path'
import logger from '@studio/log'
import fancy from '@studio/log/format/fancy'

const stream = fs.createWriteStream('./debug.log')
logger.out(stream)

const loggers = {
  boaty: logger('boaty'),
  console: logger('console')
}

// Don't overwrite the screen
console.log = loggers.console.ignore
console.warn = loggers.console.warn
console.error = loggers.console.error
console.info = loggers.console.ignore
console.debug = loggers.console.issue

export default loggers.boaty
