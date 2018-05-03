import React, { Component } from 'react'
import logger from '@boaty/boat/utils/logger'

export default class Safer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      info: null
    }
  }

  componentDidCatch(error, info) {
    logger.error('Error', info, error)

    this.setState({
      error,
      info
    });
  }

  render() {
    if (this.state.error !== null) {
      return (
        <box
          top="center"
          left="center"
          height="50%"
          width="50%"
          label="Error !"
          tags={true}
          border={{ type: 'line' }}
        >
          {this.state.error.toString()}
          {/* {`${this.state.error.toString()}`} */}
        </box>
      )
    }

    return this.props.children
  }
}
