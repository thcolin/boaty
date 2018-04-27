import React, { Component } from 'react'
import context from '@boaty/boat/services/context'

export default class Footer extends Component {
  render() {
    const commands = {
      'Tab': 'Switch',
      '↓↑': 'Move',
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
          content={[`{bold}∞{/bold} ↓ 12.5 Mb/s ↑ 7.32 Mb/s`, `{bold}#{/bold} ↓ 23.63 Tb ↑ 377.32 Tb`].join('  -  ')}
        />
        <text
          tags={true}
          right={0}
          content={context.homepage}
        />
      </box>
    )
  }
}
