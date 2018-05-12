import React, { Component } from 'react'
import { connect } from 'react-redux'
import Route from '@boaty/boat/components/Route'
import { focusRoute } from '@boaty/boat/store/ducks/router'
import screen from '@boaty/boat/services/screen'
import logger from '@boaty/boat/utils/logger'

const mapStateToProps = (state, props) => ({
  focused: state.router.focused,
})

const mapDispatchToProps = (dispatch, props) => ({
  focusRoute: (uri) => dispatch(focusRoute(uri)),
})

class Modal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      previous: '',
      hide: true
    }

    this.handleHotkey = this.handleHotkey.bind(this)

    screen.key([this.props.hotkey, 'escape'], (ch, key) => this.handleHotkey(key))
  }

  componentDidUpdate(props, state) {
    if (!this.state.hide) {
      this.props.focusRoute(this.props.uri)
    } else if (!state.hide && this.state.hide) {
      this.props.focusRoute(this.state.previous)
    }
  }

  handleHotkey(key) {
    this.setState({
      previous: this.props.focused === this.props.uri ? this.state.previous : this.props.focused,
      hide: key.full === 'escape' ? true : !this.state.hide,
    })
  }

  render() {
    const { hide } = this.state
    const { uri } = this.props

    return hide ? null : (
      <Route uri={uri}>{this.props.children}</Route>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
