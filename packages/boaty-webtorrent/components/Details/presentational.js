import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import router from '@boaty/boat/services/router'
import logger from '@boaty/boat/utils/logger'

const style = (state, props) => ({
  container: {
    top: props.style.top,
    height: props.style.height,
    width: '100%',
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: state.focused ? 'blue' : 'grey'
      },
    }
  },
  list: {
    height: props.opened ? '100%-2' : 0,
    width: '100%-2',
    fg: 'white',
    align: 'left',
    noCellBorders: true,
    style: {
      cell: {
        selected: {
          bold: true
        }
      },
    }
  }
})

export default class Details extends Component {
  static uri = '@boaty/webtorrent/details'

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

  componentWillMount() {
    router.register(Details.uri).takeWhile(() => this.refs.self).subscribe(() => this.refs.self.focus())
  }

  componentDidMount() {
    // Events
    const keys$ = Rx.Observable.fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
    const move$ = keys$.filter(event => ['up', 'down'].includes(event.key.full))
    const blur$ = Rx.Observable.fromEvent(this.refs.self, 'element blur')
    const focus$ = Rx.Observable.fromEvent(this.refs.self, 'element focus')

    // Move
    move$.subscribe(this.handleMove)

    // Focus
    Rx.Observable.merge(focus$.mapTo(true), blur$.mapTo(false)).subscribe(focused => this.setState({ focused }))
  }

  shouldComponentUpdate(props, state) {
    if (!props.item || !this.props.item || props.item.hash !== (this.props.item || {}).hash) {
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
    const width = Math.max(0, ((this.refs.self || {}).width || 0) - 4)
    const pad = 14

    if (!item) {
      return [
        ['Loading...']
      ]
    }

    const rows = ([
      ['{bold}Torrent{/bold}', item.name],
      ['{bold}Created{/bold}', humanize.date('d/m/Y - h:m:s', new Date(item.created))],
      ['{bold}Size{/bold}', humanize.filesize(item.total)],
      ['{bold}Progress{/bold}', `${humanize.numberFormat(item.progress * 100)}% (${humanize.filesize(item.downloaded)} of ${humanize.filesize(item.total)})`],
      ['{bold}Uploaded{/bold}', humanize.filesize(item.uploaded)],
      ['{bold}Remaining{/bold}', item.done ? 'Done' : item.paused ? 'Paused' : typeof item.timeRemaining === 'number' ? humanize.relativeTime((Date.now() + item.timeRemaining) / 1000).substring(3) : '∞'],
      ['{bold}Speed{/bold}', `↓ ${humanize.speed(item.downloadSpeed)} - ↑ ${humanize.speed(item.uploadSpeed)}`],
      ['{bold}Ratio{/bold}', humanize.numberFormat(item.ratio).toString()],
      ['{bold}Peers{/bold}', item.peers.toString()],
    ]).concat(item.announce.map((announce, i) => [!i ? '{bold}Announce(s){/bold}' : '', announce]))

    return rows.map(row => {
      row[1] = row[1].padEnd(width - pad, ' ')
      return row
    })
  }

  render() {
    logger.ignore('Render', Details.uri, [this.props.name])
    const { item } = this.props
    const rows = this.shapize(item)

    return (
      <box label="Details" {...style(this.state, this.props).container}>
        <listtable
          ref="self"
          keys={true}
          scroll={true}
          tags={true}
          rows={rows}
          {...style(this.state, this.props).list}
        />
      </box>
    )
  }
}
