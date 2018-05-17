import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rx from 'rxjs'
import fs from 'fs'
import p from 'path'
import { padTorrents } from '@boaty/webtorrent/actions'
import connection from '@boaty/webtorrent/utils/connection'
import config from '@boaty/boat/services/config'
import logger from '@boaty/boat/utils/logger'

const mapStateToProps = (state) => ({
  online: state.webtorrent.websocket.online,
})

const mapDispatchToProps = (dispatch) => ({
  handleOpen: (buffer) => dispatch(padTorrents(buffer))
})

const style = (state, props) => ({
  container: {
    top: '25%',
    left: '25%',
    height: '50%',
    width: '50%',
    border: {
      type: 'line',
    },
    style: {
      transparent: true,
    },
    style: {
      border: {
        fg: props.focused ? 'blue' : 'grey'
      },
    }
  },
  list: {
    top: 1,
    height: `100%-3`,
    width: '100%-2',
    pad: 4,
    align: 'left',
    noCellBorders: true,
    fg: 'white',
    style: {
      selected: {
        bg: 'white',
        fg: 'black'
      }
    }
  },
  message: {
    left: 0,
    height: 1,
    width: '100%-2',
    align: 'center',
    tags: true,
    padding: {
      left: 2,
      right: 2,
      top: 0,
      bottom: 0,
    },
    style: {
      info: {
        bg: 'blue',
        fg: 'white',
      },
      success: {
        bg: 'green',
        fg: 'black',
      },
      error: {
        bg: 'red',
        fg: 'white',
      }
    }[state.message.type]
  }
})

class Open extends Component {
  constructor(props) {
    super(props)

    this.position = {
      selected: 0,
      scroll: 0
    }

    this.state = {
      cwd: {},
      message: {},
    }

    this.handleMove = this.handleMove.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    // Events
    const keys$ = Rx.Observable.fromEvent(this.refs.self, 'element keypress', false, (el, ch, key) => ({ el, ch, key }))
    const back$ = keys$.filter(event => 'backspace' === event.key.full)
    const move$ = keys$.filter(event => ['up', 'down'].includes(event.key.full))
    const select$ = Rx.Observable.fromEvent(this.refs.self, 'select')

    // Move
    move$.subscribe(this.handleMove)

    // Select
    select$.subscribe(this.handleSelect)
    back$.subscribe(() => this.handleSelect({ content: p.dirname(this.state.cwd.path) }))

    // Explore "root"
    this.handleSelect(config['@boaty/webtorrent'].pane['open-homedir'])
  }

  shouldComponentUpdate(props, state) {
    if (state.cwd.path !== this.state.cwd.path) {
      this.position = {
        selected: 0,
        scroll: 0,
      }
    }

    return true
  }

  componentDidUpdate(props, state) {
    if (!props.focused && this.props.focused) {
      this.refs.self.focus()
    }

    this.refs.self.select(this.position.selected)
    this.refs.self.setScrollPerc(Math.min(100, this.position.scroll ? this.position.scroll + Math.ceil(this.refs.self.height / 2) : 0))
  }

  handleMove(event) {
    this.position.selected = event.el.selected
    this.position.scroll = event.el.getScrollPerc()
  }

  handleSelect(node) {
    const filename = (typeof node === 'string' ? node : node.content).trim()
    const path = p.resolve(this.state.cwd.path || p.resolve(p.sep), filename)

    fs.stat(path, (err, stats) => {
      if (stats.isDirectory()) {
        fs.readdir(path, {}, (err, content) => this.setState({
          cwd: { path, content: content.filter(file => file.charAt(0) !== '.') },
          message: { type: 'info', content: path},
        }))
      } else {
        if (p.extname(path) === '.torrent') {
          if (this.props.online) {
            fs.readFile(path, (err, data) => {
              logger.issue('err', [err])
              this.props.handleOpen(data)
              this.setState({
                message: { type: 'success', content: `${connection.host}:${connection.port}@${filename}` }
              })
            })
          } else {
            this.setState({
              message: { type: 'error', content: `Daemon ${connection.host}:${connection.port} is offline` }
            })
          }
        } else {
          this.setState({
            message: { type: 'error', content: `Only .torrent file are allowed !` }
          })
        }
      }
    })
  }

  shapize(cwd) {
    return !cwd.path ? [''] : []
      .concat((cwd.path !== p.resolve(p.sep) ? [' ..'] : []))
      .concat(cwd.content.map(content => ` ${content}`))
  }

  render() {
    const { uri } = this.props
    const { cwd, message } = this.state
    const items = this.shapize(cwd)
    logger.ignore('Render', uri)

    return (
      <box label="Open" {...style(this.state, this.props).container}>
        <box {...style(this.state, this.props).message} content={message.content}/>
        <list
          ref="self"
          keys={true}
          scroll={true}
          tags={true}
          items={items}
          {...style(this.state, this.props).list}
        />
      </box>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Open)
