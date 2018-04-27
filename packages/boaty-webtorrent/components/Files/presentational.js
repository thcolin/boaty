import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import tabulator from '@boaty/boat/services/tabulator'

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
    style: {
      selected: {
        bold: true
      },
    }
  }
})

export default class Files extends Component {
  static uri = '@boaty/webtorrent/files'

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
    tabulator.register(Files.uri).takeWhile(() => this.refs.self).subscribe(() => this.refs.self.focus())
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
  }

  componentDidUpdate() {
    this.refs.self.select(this.position.selected)
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleMove(event) {
    this.position.selected = event.el.selected
    this.position.scroll = event.el.getScrollPerc()
  }

  render() {
    const { files } = this.props

    return (
      <box label="Files" {...style(this.state, this.props).container}>
        <list
          ref="self"
          keys={true}
          interactive={true}
          tags={true}
          items={files}
          {...style(this.state, this.props).list}
        />
      </box>
    )
  }
}
