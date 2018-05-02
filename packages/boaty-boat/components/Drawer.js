import React, { Component } from 'react'
import Details from '@boaty/webtorrent/components/Details'
import Pieces from '@boaty/webtorrent/components/Pieces'
import router from '@boaty/boat/services/router'

const style = (state) => ({
  top: state.index > state.opened ? `100%-${(state.length - state.index) + 1}` : state.index,
  height: state.index === state.opened ? `100%-${state.opened + (state.length - state.index) - Math.abs(state.index === state.last)}` : 2
})

export default class Drawer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: 0
    }
  }

  componentWillMount() {
    router
      .listen()
      .filter(uri => this.props.components.map(component => component.uri).includes(uri))
      .subscribe(uri => this.setState({
        opened: this.props.components.map(component => component.uri).indexOf(uri)
      }))
  }

  render() {
    const { opened } = this.state
    const { components } = this.props

    return (
      <box>
        {components.map((component, index) => React.createElement(
          component,
          {
            key: component.uri,
            style: style({
              index: index,
              length: components.length,
              opened: opened,
              last: components.length - 1
            }),
            opened: opened === index
          }
        ))}
      </box>
    )
  }
}
