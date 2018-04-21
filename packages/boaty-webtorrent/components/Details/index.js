import { connect } from 'react-redux'
import { selectTorrent } from '@boaty/webtorrent/store/ducks/torrents'
import Details from './presentational'

const mapStateToProps = (state) => ({
  item: state.torrents.torrents.entities[state.torrents.torrents.result[state.torrents.selected]],
})

export default connect(
  mapStateToProps,
)(Details)
