import React, { Component } from 'react'
import Rx from 'rxjs'
import humanize from 'humanize'
import p from 'path'
import opn from 'opn'
import connection from '@boaty/webtorrent/utils/connection'
import logger from '@boaty/boat/utils/logger'

const style = (state = {}, props = {}) => ({
  container: {
    top: props.style.top,
    height: props.style.height,
    width: '100%',
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: props.focused ? 'blue' : 'grey'
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
  constructor(props) {
    super(props)

    this.position = {
      selected: 0,
      scroll: 0
    }

    this.handleMove = this.handleMove.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    // Events
    const keys$ = Rx.Observable.fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
    const move$ = keys$.filter(event => ['up', 'down'].includes(event.key.full))
    const select$ = Rx.Observable.fromEvent(this.refs.self, 'select')

    // Move
    move$.subscribe(this.handleMove)

    // Select
    select$.subscribe(this.handleSelect)
  }

  componentDidUpdate(props, state) {
    if (!props.focused && this.props.focused) {
      this.refs.self.focus()
    }

    this.refs.self.select(this.position.selected)
    this.refs.self.setScrollPerc(this.position.scroll)
  }

  handleMove(event) {
    this.position.selected = event.el.selected
    this.position.scroll = event.el.getScrollPerc()
  }

  handleSelect(item) {
    const content = item.content.trim()
    const path = content === this.props.path ? content : p.join(this.props.path, content)
    const prefix = connection.host === 'localhost' ? null : [
      `sftp://`,
      connection.sftp.user,
      !!connection.sftp.user && '@',
      connection.host,
      !!connection.sftp.port && ':',
      connection.sftp.port,
      '/'
    ].filter(v => v).join('')

    logger.spawn('Files', path, prefix)
    opn(`${prefix}${path}`)
  }

  shapize(path, files) {
    return [path].concat(files.map(file => ` ${file}`))
  }

  render() {
    const { path, files, uri } = this.props
    const rows = this.shapize(path, files)
    logger.ignore('Render', uri, [this.props.path])

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
