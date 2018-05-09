import React, { Component } from 'react'
import { connect } from 'react-redux'
import { statsSelector } from '@boaty/boat/store/ducks/app'
import humanize from 'humanize'
import context from '@boaty/boat/services/context'
import logger from '@boaty/boat/utils/logger'

const mapStateToProps = (state) => ({
  stats: statsSelector(state),
})

class Header extends Component {
  render() {
    const { stats } = this.props
    const values = {
      '↓': humanize.speed(stats.down),
      '↑': humanize.speed(stats.up),
      '~': humanize.numberFormat(stats.ratio, 2),
      '≡': `${stats.done}/${stats.total}`
    }

    return (
      <box>
        <text
          tags={true}
          left={0}
          content={`${context.logo}  {bold}${context.name}{/bold}{white-fg} ${context.version}`}
        />
        <text
          tags={true}
          left="center"
          content={`{bold}${Object.keys(values).map(key => `${key} ${values[key]}`).join(' ')}{/bold}`}
        />
        <text
          tags={true}
          right={0}
          content={`{bold}${stats.connections.map(connection => `${connection.host}:${connection.port}`).join(' - ')}{/bold}`}
        />
      </box>
    )
  }
}

export default connect(mapStateToProps)(Header)
