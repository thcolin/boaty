# 🌊⛴️ Boaty
A peer-2-peer cli boat - or client, will work with webtorrent and dat

<p align="center">
  <img width="800" title="Boaty - Screenshot" src="https://cdn.rawgit.com/thcolin/boaty/master/screenshot.svg">
</p>

## Run
How to run it ? - Hope to release it packaged to `brew` soon
```bash
git clone https://github.com/thcolin/boaty.git && cd boaty
cp config.default.json config.json
npm run install
npm run webtorrent:daemon #[-- --quiet --port=9876]
# in an other terminal
npm run build
./bin/boaty #[...params]
```

## Params
See below all available params:
```bash
boaty #[...params]
  --config=./config.json # path to config.json
  --webtorrent-host=localhost # webtorrent daemon host
  --webtorrent-port=9876 # webtorrent daemon port
  --webtorrent-sftp-user=me # webtorrent sftp user (for Files open)
  --webtorrent-sftp-port=22 # webtorrent sftp port (for Files open)
```

## Panes
See below for available `panes`:
* [x] WebTorrent (`@boaty/webtorrent`)
  * [x] List
  * [x] Details
  * [x] Files
  * [x] Release
  * [x] Pieces (blocks like FlashGet ❤️)
  * [x] Actions
    * [x] Pause/Resume
    * [x] Open
    * [x] Delete
    * [x] Erase
  * [x] Open-Push (magnet/.torrent to distant daemon)
  * [ ] Stream / Cast (see [webtorrent/webtorrent-cli](https://github.com/webtorrent/webtorrent-cli/blob/master/bin/cmd.js#L429)
    * AirPlay
    * Chromecast
    * Kodi (XBMC)
    * VLC
  * [ ] Speeds (cf. `vtop` diagram)
    * Use `sparkline` blessed-contrib type ?
  * [ ] Configuration (?)
* [ ] Dat (`@boaty/dat`)
  * [ ] List
  * [ ] Details
  * [ ] Actions (pause-resume/open/delete/erase)
* [ ] TMDB (or SensCritique) (`@boaty/?`)
* [ ] Trackers (`@boaty/?`)
  * [ ] YGG
  * [ ] ABN

## Configuration
You can customize your configuration in `config.json` file:
```js
{
  // Prefixed configuration for package
  "@boaty/boat": {
    // Customize boat "workspace" with JSX components
    "workspace": [
      {
        "component": "@boaty/webtorrent", // use "component" key to import custom component
        "props": {
          "key": "pane-webtorrent" // don't forget "key" props to avoid warning !
        }
      }
      // {
      //   "type": "box", // use "type" key for default blessed component
      //   "props": {
      //     "top": 1,
      //     "key": "lol"
      //   },
      //   "children": "Hello World !"
      // }
    ]
  },
  "@boaty/webtorrent": {
    "pane": {
      "open-homedir": "/tmp/webtorrent/watch"
    },
    "daemon": {
      "download-dir": "/tmp/webtorrent/done",
      "watch-dir": "/tmp/webtorrent/watch",
      "watch-delete": true
    }
  }
}
```

# Keys
* `Tab`: Switch between tiles (use `Shift` key for opposite direction)
* `↓↑`: Move
* `o`: Open import modal (push local `.torrent` file(s) to daemon)
* `Enter`: Open (folders and files in `Files` tile, and path in `Torrents`)
* `Space`: Pause / Resume (torrent in `Torrents`)
* `Backspace`: Remove (torrent in `Torrents`)
* `Delete`: Delete (torrent in `Torrents`)
* `Esc`: Close modal
* `C-c|q`: Quit

# About
* `Footer`:
  * ⛅ Online / ⛈️ Offline

# Help
* Rendering `screenshot.svg` from `asciinema`: `svg-term --cast=CAST_ID --out screenshot.svg --term=iterm2 --profile=~/.itermcolors --window`

# Inspiration
* [rtorrent-ps](http://rtorrent-ps.readthedocs.io/en/latest/)
* [rtorrent-webui](http://3.bp.blogspot.com/-qtraNrkge3k/T3IeePHeZCI/AAAAAAAABP4/K3ZY6n-ioxg/s1600/rtorrent_with_encryption.JPG)
* [transmission-gui](https://transmissionbt.com/images/screenshots/Mac-Large.png)

# Roadmap
* Implement `standardjs`
* Write `tests`
* Improve `config.json`
  * `@boaty/webtorrent`
    * [x] `download-dir`
    * [ ] `download-subfolder`
      * should have `torrent.name` on `webtorrent.add(uri, { path })` (complicated)
    * [ ] `incomplete-dir`
      * should listen for `torrent.on('done')` and edit all `torrent.files.*.path` (complicated)
    * [x] `watch-dir`
    * [x] `watch-delete`
    * [ ] `speed-limit-download`
      * not available in `webtorrent` currently (complicated)
    * [ ] `speed-limit-upload`
      * not available in `webtorrent` currently (complicated)
    * [ ] `queue-size-download`
      * should implement queue system watching for every `torrent.on('done')` (workable)
    * [ ] `queue-size-seed`
      * should implement queue system watching for every `daemon.on('pause', torrent)` (workable)
    * [ ] `blocklist-url`
    * [ ] `chmod`
      * should listen for `torrent.on('done')` and chmod `torrent.path` (workable)
    * [ ] `ratio-limit`
      * should listen for `torrent.on('upload')` until limit and then `torrent.pause()` (workable)
* `@boaty/webtorrent`
  * Fix `ducks.torrents.selected` on `actions.ENHANCE_TORRENTS`
  * Use `docker` or `pm2` to daemonize daemon
    * see [pm2 documentation](http://pm2.keymetrics.io/docs/usage/quick-start/)
  * Handle magnet `daemon.import`
  * Confirm modal on `torrents.delete` and `torrents.remove`
  * Investigate for stucked torrents on `daemon.import`
  * Improve `redux` & `websocket` integration with [Redux WebSocket Integration](https://medium.com/@ianovenden/redux-websocket-integration-c1a0d22d3189)
  * Look at [Writing a BitTorrent Client](https://luminarys.com/posts/writing-a-bittorrent-client.html)
  * `Files` should be able to open distant (`host !== 'localhost'`) files
  * `Daemon` should save torrents state (stoped) and load it on boot
  * Should send `FILL_TORRENTS` every 10s to force update
  * Keep `Daemon:torrents` index order on `pause()` and `resume()`
