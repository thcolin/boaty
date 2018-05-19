import React, { Component } from 'react'
import Spinner from '@boaty/boat/components/Spinner'
import Rx from 'rxjs'
import humanize from 'humanize'
import opn from 'opn'
import connection from '@boaty/webtorrent/utils/connection'
import logger from '@boaty/boat/utils/logger'

const style = (state = {}, props = {}) => ({
  container: {
    height: '100%',
    width: '100%',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: props.focused ? 'blue' : 'grey'
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
          bg: 'white'
        }
      },
      header: {
        bg: 'blue'
      },
    },
  }
})

export default class Torrents extends Component {
  constructor(props) {
    super(props)

    this.position = {
      scroll: 0
    }

    this.blur$ = new Rx.Subject()

    this.state = {
      focused: false
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    // Events
    const keys$ = Rx.Observable.fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
    const open$ = keys$.filter(event => 'enter' === event.key.full)
    const toggle$ = keys$.filter(event => 'space' === event.key.full)
    const remove$ = keys$.filter(event => 'backspace' === event.key.full)
    const delete$ = keys$.filter(event => 'delete' === event.key.full)
    const move$ = keys$.filter(event => ['up', 'down'].includes(event.key.full))

    // Open
    open$.subscribe(this.handleOpen)

    // Toggle
    toggle$.subscribe(this.handleToggle)

    // Remove
    remove$.subscribe(this.handleRemove)

    // Delete
    delete$.subscribe(this.handleDelete)

    // Move
    Rx.Observable.merge(
      move$.do(() => this.props.onFreeze()).debounceTime(500),
      move$.sample(this.blur$).do(() => logger.issue('blur'))
    )
    .do(event => this.position.scroll = event.el.getScrollPerc())
    .subscribe(this.handleSelect)
  }

  componentWillUpdate(props) {
    if (!props.focused && this.props.focused) {
      this.blur$.next(true)
    }
  }

  componentDidUpdate(props, state) {
    if (!props.focused && this.props.focused) {
      this.refs.self.focus()
    }

    this.refs.self.select(this.props.selected + 1) // add headers row
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleSelect(event) {
    logger.issue('handleSelect', event.el.selected - 1)
    this.props.onSelect(event.el.selected - 1) // remove headers row
    this.props.onRelease()
  }

  handleOpen(event) {
    const path = this.props.torrents[event.el.selected - 1].path
    const prefix = connection.host === 'localhost' ? null : [
      `sftp://`,
      connection.sftp.user,
      !!connection.sftp.user && '@',
      connection.host,
      !!connection.sftp.port && ':',
      connection.sftp.port,
      '/'
    ].filter(v => v).join('')

    logger.spawn('Torrents', path, prefix)
    opn(`${prefix}${path}`)
  }

  handleToggle(event) {
    const torrent = this.props.torrents[event.el.selected - 1]

    if (torrent.stoped) {
      this.props.onResume(torrent.hash)
    } else {
      this.props.onPause(torrent.hash)
    }
  }

  handleRemove(event) {
    this.props.onRemove(this.props.torrents[event.el.selected - 1].hash)
  }

  handleDelete(event) {
    this.props.onDelete(this.props.torrents[event.el.selected - 1].hash)
  }

  shapize(torrents) {
    const width = Math.max(0, ((this.refs.self || {}).width || 0) - 2)
    const headers = ['?', 'Name', '↓', '↑', '%', '#', '@']

    if (!torrents.length) {
      return [headers].concat([['', '', '', '', '', '', '']])
    }

    const rows = torrents.map(torrent => [
      (torrent.stoped ? '◼' : torrent.done ? '✔' : !torrent.ready ? '●' : '▶'),
      torrent.name,
      (torrent.done || torrent.stoped ? '-' : humanize.speed(torrent.downloadSpeed)),
      (torrent.stoped ? '-' : humanize.speed(torrent.uploadSpeed)),
      `${humanize.numberFormat(torrent.progress * 100, 0)}%`,
      humanize.filesize(torrent.total),
      (torrent.done || torrent.stoped) ? '-' : typeof torrent.timeRemaining === 'number' ? humanize.duration(torrent.timeRemaining) : '∞',
    ])

    const pad = rows.reduce((total, row) => {
      const current = row.filter((value, index) => index !== 1).reduce((total, current) => total += (current.length + style().table.pad), 0)
      return total > current ? total : current
    }, 0)

    return [headers].concat(rows.map(row => {
      const name = row[1]
      const ellipsed = (name.length > (width - pad) ? `${name.substring(0, (width - pad)).trim()}...` : name)
      row[1] = ellipsed.padEnd(width - pad, ' ')
      return row
    }))
  }

  render() {
    const { torrents, loading, uri } = this.props
    const rows = this.shapize(torrents)
    logger.ignore('Render', uri, [this.props.selected])

    return (
      <box label="Torrents" {...style(this.state, this.props).container}>
        <listtable
          ref="self"
          keys={true}
          scroll={true}
          tags={true}
          rows={rows}
          {...style(this.state, this.props).table}
        />
        {loading && (
          <box top="50%" left="50%-6">
            <Spinner text="Loading" ellipsis={true} />
          </box>
        )}
      </box>
    )
  }
}
