import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import opn from 'opn'
import router from '@boaty/boat/services/router'
import logger from '@boaty/boat/utils/logger'

const style = state => ({
  container: {
    height: '100%',
    width: '100%',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: state.focused ? 'blue' : 'grey'
      }
    }
  },
  table: {
    left: 2,
    height: '100%-2',
    width: '100%-4',
    noCellBorders: true,
    pad: 4,
    style: {
      cell: {
        selected: {
          fg: 'black',
          bg: 'brightwhite'
        }
      },
      header: {
        bg: 'blue'
      },
    },
  }
})

export default class Torrents extends Component {
  static uri = '@boaty/webtorrent/torrents'

  constructor(props) {
    super(props)

    this.position = {
      scroll: 0
    }

    this.state = {
      focused: false
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount() {
    router.register(Torrents.uri, true).subscribe(() => this.refs.self.focus())
  }

  componentDidMount() {
    // Events
    const keys$ = Rx.Observable.fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
    const open$ = keys$.filter(event => 'enter' === event.key.full)
    const toggle$ = keys$.filter(event => 'space' === event.key.full)
    const move$ = keys$.filter(event => ['up', 'down'].includes(event.key.full))
    const blur$ = Rx.Observable.fromEvent(this.refs.self, 'element blur')
    const focus$ = Rx.Observable.fromEvent(this.refs.self, 'element focus')

    // Open
    open$.subscribe(this.handleOpen)

    // Toggle
    toggle$.subscribe(this.handleToggle)

    // Move
    Rx.Observable.merge(
      move$.do(() => this.props.onFreeze()).do(event => this.position.scroll = event.el.getScrollPerc()).debounceTime(500),
      move$.sample(blur$)
    ).subscribe(this.handleSelect)

    // Focus
    Rx.Observable.merge(focus$.mapTo(true), blur$.mapTo(false)).subscribe(focused => this.setState({ focused }))
  }

  componentDidUpdate() {
    this.refs.self.select(this.props.selected + 1) // add headers row
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleSelect(event) {
    this.props.onSelect(event.el.selected - 1) // remove headers row
    this.props.onUnfreeze()
  }

  handleOpen(event) {
    opn(this.props.torrents[event.el.selected - 1].path)
  }

  handleToggle(event) {
    const torrent = this.props.torrents[event.el.selected - 1]

    if (torrent.stoped) {
      this.props.onResume(torrent.hash)
    } else {
      this.props.onPause(torrent.hash)
    }
  }

  shapize(torrents) {
    const width = Math.max(0, ((this.refs.self || {}).width || 0) - 2)

    if (!torrents.length) {
      return [
        ['Loading'],
        ['Loading...']
      ]
    }

    const rows = torrents.map(torrent => [
      (torrent.stoped ? '◼' : torrent.done ? '✔' : '▶'),
      torrent.name,
      (torrent.done || torrent.stoped ? '-' : humanize.speed(torrent.downloadSpeed)),
      (torrent.stoped ? '-' : humanize.speed(torrent.uploadSpeed)),
      `${humanize.numberFormat(torrent.progress * 100, 0)}%`,
      humanize.filesize(torrent.total),
      (torrent.done || torrent.stoped) ? '-' : typeof torrent.timeRemaining === 'number' ? humanize.relativeTime((Date.now() + torrent.timeRemaining) / 1000).substring(3) : '∞',
    ])

    const pad = rows.reduce((total, row) => {
      const current = row.filter((value, index) => index !== 1).reduce((total, current) => total += (current.length + style({}).table.pad), 0)
      return total > current ? total : current
    }, 0)

    return [['?', 'Name', '↓', '↑', '%', '#', '@']].concat(rows.map(row => {
      const name = row[1]
      const ellipsed = (name.length > (width - pad) ? `${name.substring(0, (width - pad)).trim()}...` : name)
      row[1] = ellipsed.padEnd(width - pad, ' ')
      return row
    }))
  }

  render() {
    logger.ignore('Render', Torrents.uri, [this.props.selected])
    const { torrents } = this.props
    const rows = this.shapize(torrents)

    return (
      <box label="Torrents" {...style(this.state).container}>
        <listtable
          ref="self"
          keys={true}
          scroll={true}
          tags={true}
          rows={rows}
          {...style(this.state).table}
        />
      </box>
    )
  }
}
