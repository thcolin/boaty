import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Pane from '@boaty/webtorrent/components/Pane'
import store from '@boaty/webtorrent/store'

export default class WebTorrent extends Component {
  render() {
    return (
      <Provider store={store}>
        <Pane />
      </Provider>
    )
  }
}
