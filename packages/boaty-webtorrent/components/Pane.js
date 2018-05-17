import React, { Component } from 'react'
import Drawer from '@boaty/boat/components/Drawer'
import Route from '@boaty/boat/components/Route'
import Modal from '@boaty/boat/components/Modal'
import Open from '@boaty/webtorrent/components/Modals/Open'
import Torrents from '@boaty/webtorrent/components/Torrents'
import Details from '@boaty/webtorrent/components/Details'
import Files from '@boaty/webtorrent/components/Files'
import Pieces from '@boaty/webtorrent/components/Pieces'
import Release from '@boaty/webtorrent/components/Release'

export default class Pane extends Component {
  render() {
    return (
      <box>
        <box top="0%" height="70%">
          <Route uri="@boaty/webtorrent/torrents" autofocus={true}>
            <Torrents />
          </Route>
        </box>
        <box top="70%" height="30%">
          <box left="0%" width="50%">
            <Drawer elements={[
              <Route uri="@boaty/webtorrent/details">
                <Details />
              </Route>,
              <Route uri="@boaty/webtorrent/files">
                <Files />
              </Route>,
              <Route uri="@boaty/webtorrent/release">
                <Release />
              </Route>
            ]} />
          </box>
          <box left="50%" width="50%">
            <Drawer elements={[
              <Route uri="@boaty/webtorrent/pieces">
                <Pieces />
              </Route>
            ]} />
          </box>
        </box>
        <Modal uri="@boaty/webtorrent/modals/open" hotkey="o">
          <Open />
        </Modal>
      </box>
    )
  }
}
