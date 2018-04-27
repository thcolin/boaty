import React, { Component } from 'react'
import Torrents from '@boaty/webtorrent/components/Torrents'
import Drawer from '@boaty/webtorrent/components/Drawer'
import Details from '@boaty/webtorrent/components/Details'
import Files from '@boaty/webtorrent/components/Files'
import Pieces from '@boaty/webtorrent/components/Pieces'
import Release from '@boaty/webtorrent/components/Release'

export default class Pane extends Component {
  render() {
    return (
      <box>
        <box top="0%" height="70%">
          <Torrents />
        </box>
        <box top="70%" height="30%">
          <box left="0%" width="50%">
            <Drawer components={[Details, Files, Release]} />
          </box>
          <box left="50%" width="50%">
            <Drawer components={[Pieces]} />
          </box>
        </box>
      </box>
    )
  }
}
