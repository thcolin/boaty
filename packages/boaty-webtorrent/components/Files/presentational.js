import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import p from 'path'
import opn from 'opn'
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
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillMount() {
    router.register(Files.uri).takeWhile(() => this.refs.self).subscribe(() => this.refs.self.focus())
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

    const select$ = Rx.Observable
      .fromEvent(this.refs.self, 'select')

    // Move
    move$.subscribe(this.handleMove)

    // Focus
    Rx.Observable.merge(focus$.mapTo(true), blur$.mapTo(false))
      .subscribe(focused => this.setState({ focused }))

    // Select
    select$.subscribe(this.handleSelect)
  }

  componentDidUpdate() {
    this.refs.self.select(this.position.selected)
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleMove(event) {
    this.position.selected = event.el.selected
    this.position.scroll = event.el.getScrollPerc()
  }

  handleSelect(item) {
    const content = item.content.trim()
    const value = content === this.props.path ? content : p.join(this.props.path, content)
    logger.spawn('Files', value)
    opn(value)
  }

  shapize(path, files) {
    return [path].concat(files.map(file => ` ${['.', file].join(p.sep)}`))
  }

  render() {
    logger.ignore('Render', Files.uri, [this.props.path])
    const { path, files } = this.props
    const rows = this.shapize(path, files)

    return (
      <box label="Files" {...style(this.state, this.props).container}>
        <list
          ref="self"
          keys={true}
          interactive={true}
          tags={true}
          items={rows}
          {...style(this.state, this.props).list}
        />
      </box>
    )
  }
}
