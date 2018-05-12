import React, { Component } from 'react'
import { connect } from 'react-redux'

const style = (state) => ({
  top: state.index > state.opened ? `100%-${(state.length - state.index) + 1}` : state.index,
  height: state.index === state.opened ? `100%-${state.opened + (state.length - state.index) - Math.abs(state.index === state.last)}` : 2
})

const mapStateToProps = (state) => ({
  focused: state.router.focused
})

class Drawer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: 0
    }
  }

  componentWillUpdate(props) {
    const index = this.props.elements.map(element => element.props.uri).indexOf(props.focused)
    if (index !== -1 && index !== this.state.opened) {
      this.setState({
        opened: index
      })
    }
  }

  render() {
    const { opened } = this.state
    const { elements } = this.props

    return (
      <box>
        {elements.map((element, index) => React.cloneElement(
          element,
          {
            key: element.props.uri,
            style: style({
              index: index,
              length: elements.length,
              opened: opened,
              last: elements.length - 1
            }),
            opened: opened === index
          }
        ))}
      </box>
    )
  }
}

export default connect(mapStateToProps)(Drawer)
