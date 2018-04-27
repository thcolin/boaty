# 🌊⛴️ Boaty
A peer-2-peer cli boat - or client, will work with webtorrent and dat

![Boaty - Screenshot](https://raw.githubusercontent.com/thcolin/boaty/master/screenshot.gif)

## Run
How to run it ? - Hope to release it packaged to `brew` soon
```bash
git clone https://github.com/thcolin/boaty.git && cd boaty
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
  * [x] Release
  * [x] Pieces (blocks like FlashGet ❤️, cf. `vtop` diagram)
  * [ ] Speeds (cf. `vtop` diagram)
  * [ ] Actions (pause-resume/open/delete/erase)
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
  }
}
```

# Keys
* `Tab`: Switch between tiles
* `↓↑`: Move
* `Esc|q`: Quit

# Roadmap
* Improve `config.json`
  * `@boaty/webtorrent`
    * see [Transmission](https://github.com/transmission/transmission/wiki/Editing-Configuration-Files)
* `@boaty/boat`
  * Enable `Shift+Tab` in `tabulator`
  * Use `loading` blessed type until app is ready
  * Fix `Header` and `Footer` data
* `@boaty/webtorrent`
  * Implement `open` on `Details/Directory` and `Files/*`
  * Split stable/unstable from `Details` in two components
  * Cache data (like `release`)
  * Refine `reducer` splitting
    * by `torrent`
    * and by `key` updated (?)
