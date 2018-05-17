const argv = require('minimist')(process.argv.slice(2))

export default {
  host: argv['webtorrent-host'] || 'localhost',
  port: argv['webtorrent-port'] || 9876,
  sftp: {
    user: argv['webtorrent-sftp-user'] || null,
    port: argv['webtorrent-sftp-port'] || null,
  }
}
