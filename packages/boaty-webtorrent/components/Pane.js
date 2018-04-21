import React, { Component } from 'react'
import Torrents from '@boaty/webtorrent/components/Torrents'
import Details from '@boaty/webtorrent/components/Details'
import Release from '@boaty/webtorrent/components/Release'

export default class Pane extends Component {
  render() {
    return (
      <box>
        <box left="0%" width="50%">
          <Torrents />
        </box>
        <box left="50%" width="50%">
          <box top="0%" height="100%-16">
            <Details />
          </box>
          <box top="100%-16" height={16}>
            <Release />
          </box>
        </box>
      </box>
    )
  }
}
