import { connect } from 'react-redux'
import { partialTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import { siftTorrents, pauseTorrent, resumeTorrent, removeTorrent, deleteTorrent } from '@boaty/webtorrent/actions'
import { freezeWebsocket, releaseWebsocket } from '@boaty/webtorrent/store/ducks/websocket'
import Torrents from './presentational'

const mapStateToProps = (state) => ({
  loading: !state.websocket.online,
  selected: state.torrents.selected,
  torrents: partialTorrentsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (index) => dispatch(siftTorrents(index)),
  onPause: (hash) => dispatch(pauseTorrent(hash)),
  onResume: (hash) => dispatch(resumeTorrent(hash)),
  onRemove: (hash) => dispatch(removeTorrent(hash)),
  onDelete: (hash) => dispatch(deleteTorrent(hash)),
  onFreeze: () => dispatch(freezeWebsocket()),
  onRelease: () => dispatch(releaseWebsocket()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Torrents)
