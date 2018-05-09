import React, { Component } from 'react'
import context from '@boaty/boat/services/context'
import { connect } from 'react-redux'
import { readySelector, statsSelector } from '@boaty/boat/store/ducks/app'

const mapStateToProps = (state) => ({
  ready: readySelector(state),
  stats: statsSelector(state),
})

class Footer extends Component {
  render() {
    const { ready, stats } = this.props
    const commands = {
      'Tab': 'Switch',
      '↓↑': 'Move',
      'Enter': 'Open',
      'Space': 'Pause-Resume',
      'Back': 'Remove',
      'Del': 'Delete',
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
          content={`{bold}${stats.connections.map(connection => `${connection.host}:${connection.port}`).join(' - ')}{/bold} - ${ready ? '⛅ ' : '⛈️ '}`}
        />
      </box>
    )
  }
}

export default connect(mapStateToProps)(Footer)
