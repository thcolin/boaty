import { connect } from 'react-redux'
import { siftedTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import Pieces from './presentational'

const mapStateToProps = (state) => ({
  pieces: (siftedTorrentsSelector(state) || {}).pieces || [],
})

export default connect(
  mapStateToProps,
)(Pieces)
