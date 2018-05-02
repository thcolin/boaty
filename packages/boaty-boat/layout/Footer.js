import React, { Component } from 'react'
import context from '@boaty/boat/services/context'
import { connect } from 'react-redux'
import { onlineSelector } from '@boaty/boat/store/ducks/app'

const mapStateToProps = (state) => ({
  online: onlineSelector(state),
})

class Footer extends Component {
  render() {
    const { online } = this.props
    const commands = {
      'Tab': 'Switch',
      '↓↑': 'Move',
      'Enter': 'Open',
      'q': 'Quit',
    }

    return (
      <box>
        <text
          tags={true}
          left={0}
          content={Object.keys(commands).map(command => `{white-bg}{black-fg}${command}{/black-fg}{/white-bg} ${commands[command]}`).join('  ')}
        />
        <text
          tags={true}
          left="center"
        />
        <text
          tags={true}
          right={0}
          content={`${context.homepage} - ${online ? '⛅ ' : '⛈️ '}`}
        />
      </box>
    )
  }
}

export default connect(mapStateToProps)(Footer)
