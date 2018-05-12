import React, { Component } from 'react'
import Rx from 'rxjs'
import logger from '@boaty/boat/utils/logger'

const style = (state = {}, props = {}) => ({
  top: props.style.top,
  height: props.style.height,
  width: '100%',
  fg: 'white',
  align: 'left',
  border: {
    type: 'line',
  },
  style: {
    border: {
      fg: props.focused ? 'blue' : 'grey'
    },
  }
})

export default class Pieces extends Component {
  shapize(pieces) {
    return pieces
      .map(value => value === 1 ? '{blue-fg}◼{/blue-fg}' : value === 0 ? '{bright-fg}◼{/bright-fg}' : '{grey-fg}◼{/grey-fg}') // ◻
      .join('')
  }

  componentDidUpdate(props, state) {
    if (!props.focused && this.props.focused) {
      this.refs.self.focus()
    }
  }

  render() {
    const { pieces, uri } = this.props
    const content = this.shapize(pieces)
    logger.ignore('Render', uri, [this.props.pieces.length])

    return (
      <box
        ref="self"
        label="Pieces"
        keys={true}
        scrollable={true}
        tags={true}
        content={content}
        {...style(this.state, this.props)}
      />
    )
  }
}
