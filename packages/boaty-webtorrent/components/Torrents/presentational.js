import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import tabulator from '@boaty/boat/singletons/tabulator'

const COMPONENT = 'webtorrent/torrents'
const style = state => ({
  height: '100%',
  width: '100%',
  align: 'center',
  noCellBorders: true,
  pad: 0,
  border: {
    type: 'line'
  },
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
    border: {
      fg: state.focused ? 'blue' : 'grey'
    }
  },
})

export default class Torrents extends Component {
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

    // Tabulator
    tabulator
      .register(COMPONENT)
      .subscribe(() => this.refs.self.focus())

    tabulator.push(COMPONENT)
  }

  componentDidUpdate() {
    this.refs.self.select(this.props.selected + 1) // add headers row
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleSelect(event) {
    this.props.onSelect(event.el.selected - 1) // remove headers row
  }

  shapize(items) {
    if (!items.result.length) {
      return [
        ['Loading'],
        ['Loading...']
      ]
    }

    return [['?', 'Name', '↓', '↑', '%', '#', '@']]
      .concat(items.result.map(key => items.entities[key]).map(item => [
        item.done ? '✔' : item.paused ? '◼' : '▶',
        (item.name.length > 40 ? `${item.name.substring(0, 40).trim()}...` : item.name),
        item.done || item.paused ? '-' : `${humanize.filesize(item.downloadSpeed)}/s`.replace(/bytes/g, 'b'),
        `${humanize.filesize(item.uploadSpeed)}/s`.replace(/bytes/g, 'b'),
        `${humanize.numberFormat(item.progress * 100, 0)}%`,
        humanize.filesize(item.total),
        item.done ? '-' : item.paused ? '-' : typeof item.timeRemaining === 'number' ? humanize.relativeTime((Date.now() + item.timeRemaining) / 1000).substring(3) : '∞',
      ]))
  }

  render() {
    const { payload } = this.props
    const rows = this.shapize(payload)

    return (
      <listtable
        ref="self"
        keys={true}
        scroll={true}
        tags={true}
        rows={rows}
        {...style(this.state)}
      />
    )
  }
}
