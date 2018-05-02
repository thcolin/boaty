import { connect } from 'react-redux'
import { siftedTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import Details from './presentational'

const mapStateToProps = (state) => ({
  item: siftedTorrentsSelector(state) || null,
})

export default connect(
  mapStateToProps,
)(Details)
