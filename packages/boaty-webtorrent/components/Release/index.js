import { connect } from 'react-redux'
import { siftedTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import Release from './presentational'

const mapStateToProps = (state) => ({
  name: (siftedTorrentsSelector(state) || {}).name,
})

export default connect(
  mapStateToProps,
)(Release)
