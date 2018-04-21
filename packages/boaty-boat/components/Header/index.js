import React, { Component } from 'react'
import context from '@boaty/boat/singletons/context'

export default class Header extends Component {
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
          content={`{bold}Speed Average: ↓ 12.5 Mb/s ↑ 7.32 Mb/s{/bold}`}
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
