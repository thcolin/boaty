import React, { Component } from 'react'
import Rx from 'rxjs'
import tabulator from '@boaty/boat/services/tabulator'

const style = (state, props) => ({
  top: props.style.top,
  height: props.style.height,
  width: '100%',
  fg: 'white',
  align: 'left',
  border: {
    type: 'line',
  },
  style: {
    border: {
      fg: state.focused ? 'blue' : 'grey'
    },
  }
})

export default class Pieces extends Component {
  static uri = '@boaty/webtorrent/pieces'

  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }
  }

  componentWillMount() {
    tabulator.register(Pieces.uri).takeWhile(() => this.refs.self).subscribe(() => this.refs.self.focus())
  }

  componentDidMount() {
    const blur$ = Rx.Observable.fromEvent(this.refs.self, 'element blur')
    const focus$ = Rx.Observable.fromEvent(this.refs.self, 'element focus')

    // Focus
    Rx.Observable
      .merge(focus$.mapTo(true), blur$.mapTo(false))
      .subscribe(focused => this.setState({ focused }))
  }

  componentWillUnmount() {
    tabulator.rescind(Pieces.uri)
  }

  render() {
    const { pieces } = this.props

    return (
      <box
        ref="self"
        label="Pieces"
        keys={true}
        scrollable={true}
        tags={true}
        content={pieces
          .map(value => value === 1 ? '{blue-fg}◼{/blue-fg}' : value === 0 ? '{bright-fg}◼{/bright-fg}' : '{grey-fg}◼{/grey-fg}')
          .join('')
        } // ◻
        {...style(this.state, this.props)}
      />
    )
  }
}