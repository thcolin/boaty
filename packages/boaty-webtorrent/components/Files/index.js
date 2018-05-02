import { connect } from 'react-redux'
import { siftedTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import Files from './presentational'

const mapStateToProps = (state) => ({
  path: (siftedTorrentsSelector(state) || {}).path || '',
  files: (siftedTorrentsSelector(state) || {}).files || [],
})

export default connect(
  mapStateToProps,
)(Files)
