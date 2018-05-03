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
npm run webtorrent:daemon #[-- --quiet]
# in an other terminal
npm run build && npm run start
```

## Panes
See below for available `panes`:
* [x] WebTorrent (`@boaty/webtorrent`)
  * [x] List
  * [x] Details
  * [x] Files
  * [x] Release
  * [x] Pieces (blocks like FlashGet ❤️)
  * [ ] Actions (pause-resume/open/delete/erase)
  * [ ] Stream (?)
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
    "download-dir": "/tmp/webtorrent/done",
    "watch-dir": "/tmp/webtorrent/watch",
    "watch-delete": true
  }
}
```

# Keys
* `Tab`: Switch between tiles (use `Shift` key for opposite direction)
* `↓↑`: Move
* `Enter`: Open (folders and files in `Files` tile)
* `Esc|q`: Quit

# About
* `Footer`:
  * ⛅ Online / ⛈️ Offline

# Help
* Rendering `screenshot.svg` from `asciinema`: `svg-term --cast=CAST_ID --out screenshot.svg --term=iterm2 --profile=~/.itermcolors --window`

# Roadmap
* Implement `standardjs`
* Write `tests`
* Improve `config.json`
  * `@boaty/webtorrent`
    * [x] `download-dir`
    * [ ] `incomplete-dir`
      * should listen for `torrent.on('done')` and edit all `torrent.files.*.path`
    * [x] `watch-dir`
    * [x] `watch-delete`
    * [ ] `speed-limit-download`
      * not available in `webtorrent` currently
    * [ ] `speed-limit-upload`
      * not available in `webtorrent` currently
    * [ ] `queue-size-download`
      * should implement queue system watching for every `torrent.on('done')`
    * [ ] `queue-size-seed`
      * should implement queue system watching for every `daemon.on('pause', torrent)`
    * [ ] `blocklist-url`
    * [ ] `chmod`
      * should listen for `torrent.on('done')` and chmod `torrent.path`
    * [ ] `ratio-limit`
      * should listen for `torrent.on('upload')` until limit and then `torrent.pause()`
* `@boaty/webtorrent`
  * Use `@boaty/boat/Spinner` component will other components are loading
