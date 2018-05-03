import fs from 'fs'
import path from 'path'
import logger from '@studio/log'
import fancy from '@studio/log/format/fancy'

const stream = fs.createWriteStream('./debug.log')
logger.out(stream)

const loggers = {
  boaty: logger('boaty'),
}

// Don't overwrite the screen
console.log = () => {}
console.warn = () => {}
console.error = () => {}
console.info = () => {}
console.debug = () => {}

export default loggers.boaty
