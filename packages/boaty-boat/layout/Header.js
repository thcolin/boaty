import React, { Component } from 'react'
import { connect } from 'react-redux'
import { statsSelector } from '@boaty/boat/store/ducks/app'
import humanize from 'humanize'
import context from '@boaty/boat/services/context'

const mapStateToProps = (state) => ({
  stats: statsSelector(state),
})

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      now: new Date()
    }

    setInterval(() => this.setState({
      now: new Date()
    }), 1000)
  }

  render() {
    const { stats } = this.props

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
          content={`{bold}↓ ${humanize.speed(stats.down)} ↑ ${humanize.speed(stats.up)} ~ ${humanize.numberFormat(stats.ratio, 2)}{/bold}`}
        />
        <text
          tags={true}
          right={0}
          content={[
            this.state.now.getHours(),
            this.state.now.getMinutes(),
            this.state.now.getSeconds(),
          ].map(value => value.toString().padStart(2, '0')).join(':')}
        />
      </box>
    )
  }
}

export default connect(mapStateToProps)(Header)
