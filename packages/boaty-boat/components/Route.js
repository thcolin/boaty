import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerRoute, focusRoute, rescindRoute } from '@boaty/boat/store/ducks/router'

const mapStateToProps = (state, props) => ({
  focused: props.uri === state.router.focused
})

const mapDispatchToProps = (dispatch, props) => ({
  focusRoute: (uri) => dispatch(focusRoute(uri)),
  registerRoute: (uri) => dispatch(registerRoute(uri)),
  rescindRoute: (uri) => dispatch(rescindRoute(uri)),
})

class Route extends Component {
  componentWillMount() {
    this.props.registerRoute(this.props.uri)

    if (this.props.autofocus) {
      this.props.focusRoute(this.props.uri)
    }
  }

  componentWillUnmount() {
    this.props.rescindRoute(this.props.uri)
  }

  render() {
    const { children, uri, focused, autofocus, ...props } = this.props
    return React.cloneElement(children, { uri, focused, ...props })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Route)
