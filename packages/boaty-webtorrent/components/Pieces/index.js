import { connect } from 'react-redux'
import Pieces from './presentational'

const mapStateToProps = (state) => ({
  pieces: (state.torrents.torrents.entities[state.torrents.torrents.result[state.torrents.selected]] || {}).pieces || [],
})

export default connect(
  mapStateToProps,
)(Pieces)
