# 🌊⛴️ Boaty
A peer-2-peer cli boat - or client, will work with webtorrent and dat

![Boaty - Screenshot](https://raw.githubusercontent.com/thcolin/boaty/master/screenshot.svg)

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
  * [x] Files
  * [x] Release
  * [x] Pieces (blocks like FlashGet ❤️)
  * [ ] Stream (?)
  * [ ] Speeds (cf. `vtop` diagram)
    * Use `sparkline` blessed-contrib type ?
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
    * see [Transmission](https://github.com/transmission/transmission/wiki/Editing-Configuration-Files)
* `@boaty/webtorrent`
  * Use `@boaty/boat/Spinner` component will other components are loading
