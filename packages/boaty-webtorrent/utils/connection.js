const argv = require('minimist')(process.argv.slice(2))

export default {
  host: argv['webtorrent-host'] || 'localhost',
  port: argv['webtorrent-port'] || 9876
}
