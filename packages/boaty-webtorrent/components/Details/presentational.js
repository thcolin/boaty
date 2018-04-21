import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import tabulator from '@boaty/boat/singletons/tabulator'

const COMPONENT = 'webtorrent/details'
const style = state => ({
  height: '100%',
  width: '100%',
  fg: 'white',
  align: 'left',
  noCellBorders: true,
  border: {
    type: 'line',
  },
  style: {
    cell: {
      selected: {
        bold: true
      }
    },
    border: {
      fg: state.focused ? 'blue' : 'grey'
    },
  }
})

export default class Details extends Component {
  constructor(props) {
    super(props)

    this.position = {
      selected: 0,
      scroll: 0
    }

    this.state = {
      focused: false
    }

    this.handleMove = this.handleMove.bind(this)
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
    move$.subscribe(this.handleMove)

    // Focus
    Rx.Observable.merge(focus$.mapTo(true), blur$.mapTo(false))
      .subscribe(focused => this.setState({ focused }))

    // Tabulator
    tabulator
      .register(COMPONENT)
      .subscribe(() => this.refs.self.focus())
  }

  shouldComponentUpdate(props, state) {
    if (props.item.hash !== (this.props.item || {}).hash) {
      this.position.selected = 0
    }

    return true
  }

  componentDidUpdate() {
    this.refs.self.select(this.position.selected + 1) // add headers row
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleMove(event) {
    this.position.selected = event.el.selected - 1 // remove headers row
    this.position.scroll = event.el.getScrollPerc()
  }

  shapize(item) {
    if (!item) {
      return [
        ['Loading...']
      ]
    }

    return ([
      ['{bold}Name{/bold}', item.name],
      ['{bold}Created{/bold}', humanize.date('d/m/Y - h:m:s', new Date(item.created))],
      ['{bold}Size{/bold}', humanize.filesize(item.total)],
      ['{bold}Progress{/bold}', `${humanize.numberFormat(item.progress * 100)}% (${humanize.filesize(item.downloaded)} of ${humanize.filesize(item.total)})`],
      ['{bold}Uploaded{/bold}', humanize.filesize(item.uploaded)],
      ['{bold}Remaining{/bold}', item.done ? 'Done' : item.paused ? 'Paused' : typeof item.timeRemaining === 'number' ? humanize.relativeTime((Date.now() + item.timeRemaining) / 1000).substring(3) : '∞'],
      ['{bold}Speed{/bold}', `↓ ${humanize.filesize(item.downloadSpeed)}/s - ↑ ${humanize.filesize(item.uploadSpeed)}/s`],
    ]).concat(item.announce.map((announce, i) => [!i ? '{bold}Announce(s){/bold}' : '', announce])).concat([
      ['{bold}Directory{/bold}', item.path],
      ['{bold}Ratio{/bold}', humanize.numberFormat(item.ratio).toString()],
      ['{bold}Peers{/bold}', item.peers.toString()],
    ]).concat(item.files.map((file, i) => [!i ? '{bold}Files(s){/bold}' : '', file]))
  }

  render() {
    const { item } = this.props
    const rows = this.shapize(item)

    return (
      <listtable
        // label="Details"
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
