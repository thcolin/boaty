import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import tabulator from '@boaty/boat/services/tabulator'
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
    // align: 'left',
    pad: 4,
    style: {
      header: {
        // align: 'center',
      },
      cell: {
        // align: 'left',
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
  }

  componentWillMount() {
    tabulator.register(Torrents.uri, true).subscribe(() => this.refs.self.focus())
  }

  componentDidMount() {
    // Events
    const move$ = Rx.Observable
      .fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
      .filter(event => ['up', 'down'].includes(event.key.full))

    const blur$ = Rx.Observable
      .fromEvent(this.refs.self, 'element blur')

    const focus$ = Rx.Observable
      .fromEvent(this.refs.self, 'element focus')

    // Move
    Rx.Observable.merge(
      move$
        .do(() => this.props.onFreeze())
        .do(event => this.position.scroll = event.el.getScrollPerc())
        .debounceTime(500),
      move$
        .sample(blur$)
    )
    .do(() => this.props.onUnfreeze())
    .subscribe(this.handleSelect)

    // Focus
    Rx.Observable.merge(focus$.mapTo(true), blur$.mapTo(false))
      .subscribe(focused => this.setState({ focused }))
  }

  componentDidUpdate() {
    this.refs.self.select(this.props.selected + 1) // add headers row
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleSelect(event) {
    this.props.onSelect(event.el.selected - 1) // remove headers row
  }

  shapize(items) {
    const width = Math.max(0, ((this.refs.self || {}).width || 0) - 4)

    if (!items.result.length) {
      return [
        ['Loading'],
        ['Loading...']
      ]
    }

    const rows = items.result.map(key => items.entities[key]).map(item => [
      (item.done ? '✔' : item.paused ? '◼' : '▶'),
      item.name,
      (item.done || item.paused ? '-' : `${humanize.filesize(item.downloadSpeed)}/s`.replace(/bytes/g, 'b')),
      `${humanize.filesize(item.uploadSpeed)}/s`.replace(/bytes/g, 'b'),
      `${humanize.numberFormat(item.progress * 100, 0)}%`,
      humanize.filesize(item.total),
      item.done ? '-' : item.paused ? '-' : typeof item.timeRemaining === 'number' ? humanize.relativeTime((Date.now() + item.timeRemaining) / 1000).substring(3) : '∞',
    ])

    const pad = rows.reduce((total, row) => {
      const current = row.filter((value, index) => index !== 1).reduce((total, current) => total += (current.length + style({}).table.pad), 0)
      return total > current ? total : current
    }, 0)

    return [['?', 'Name', '↓', '↑', '%', '#', '@']].concat(rows.map(row => {
      const name = row[1]
      const ellipsed = (name.length > (width - pad) ? `${name.substring(0, (width - pad)).trim()}...` : name)
      row[1] = ellipsed.padEnd(width + style({}).table.pad - pad, ' ')
      return row
    }))
  }

  render() {
    const { payload } = this.props
    const rows = this.shapize(payload)

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
