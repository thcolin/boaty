import React, { Component } from 'react'
import Header from '@boaty/boat/components/Header'
import Footer from '@boaty/boat/components/Footer'
import transform from '@boaty/boat/utils/transform'
import config from '@boaty/boat/singletons/config'

export default class App extends Component {
  render() {
    return (
      <box height="100%" width="100%">
        <box top={0} height={1}>
          <Header />
        </box>
        <box top={1} bottom={1} height="100%-2" width="100%">
          {transform(config['@boaty/boat'].workspace)}
        </box>
        <box bottom={0} height={1}>
          <Footer />
        </box>
      </box>
    )
  }
}
