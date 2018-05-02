import React, { Component } from 'react'
import spinners from 'cli-spinners'

export default class Spinner extends Component {
  constructor(props) {
    super(props)

    this.state = Object.assign(spinners[Object.keys(spinners).includes(props.name) ? props.name : 'dots'], {
      beat: 0
    })
  }

  componentDidMount() {
    this.setState({
      intid: setInterval(() => {
        this.setState({ beat: this.state.beat + 1 })
      }, this.state.interval)
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intid)
  }

  render() {
    const { frames, beat } = this.state

    return (
      <box>{frames[beat % frames.length]}</box>
    )
  }
}
