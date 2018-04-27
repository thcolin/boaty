import { connect } from 'react-redux'
import Files from './presentational'

const mapStateToProps = (state) => ({
  files: (state.torrents.torrents.entities[state.torrents.torrents.result[state.torrents.selected]] || {}).files || [],
})

export default connect(
  mapStateToProps,
)(Files)
