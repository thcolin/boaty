# 🌊⛴️ Boaty
A peer-2-peer cli boat - or client, will work with webtorrent and dat

![Boaty - Screenshot](https://raw.githubusercontent.com/thcolin/boaty/master/screenshot.png)

## Panes
See below for available `panes`:
* [x] WebTorrent (`@boaty/webtorrent`)
  * [x] List
  * [x] Details
  * [x] Release
  * [ ] Progress (blocks like FlashGet ❤️, cf. `vtop` diagram)
  * [ ] Speeds (cf. `vtop` diagram)
  * [ ] Actions (pause-resume/open/delete/erase)
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
          "key": "pane-webtorrent"
        }
      }
      // {
      //   "type": "box", // use "box" key for default blessed component
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
* `Tab`: Switch between panes
* `↓↑`: Move

# Roadmap
* Improve `config.json`
  * `@boaty/webtorrent`
    * see [Transmission](https://github.com/transmission/transmission/wiki/Editing-Configuration-Files)
* `@boaty/boat`
  * Fix `Header` and `Footer` data
* `@boaty/webtorrent`
  * Split stable/unstable from `Details` in two components
  * Cache data (like `release`)
  * Refine `reducer` splitting
    * by `torrent`
    * and by `key` updated (?)
