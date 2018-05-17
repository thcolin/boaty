import p from 'path'
import fs from 'fs'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const fallback = p.resolve(process.argv[1], '..', '..', 'config.json')
const path = argv['config'] && p.resolve(process.cwd(), ...argv['config'].split(p.sep))

import logger from '@boaty/boat/utils/logger'
logger.issue('path', path)
logger.issue('fallback', fallback)

export default require(fs.existsSync(path) ? path : fallback)
