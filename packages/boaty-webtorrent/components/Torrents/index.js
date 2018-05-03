import { connect } from 'react-redux'
import { partialTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import { siftTorrents, pauseTorrent, resumeTorrent, removeTorrent, deleteTorrent } from '@boaty/webtorrent/actions'
import { freezePane, unfreezePane } from '@boaty/webtorrent/store/ducks/pane'
import Torrents from './presentational'

const mapStateToProps = (state) => ({
  selected: state.torrents.selected,
  torrents: partialTorrentsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (index) => dispatch(siftTorrents(index)),
  onPause: (hash) => dispatch(pauseTorrent(hash)),
  onResume: (hash) => dispatch(resumeTorrent(hash)),
  onRemove: (hash) => dispatch(removeTorrent(hash)),
  onDelete: (hash) => dispatch(deleteTorrent(hash)),
  onFreeze: () => dispatch(freezePane()),
  onUnfreeze: () => dispatch(unfreezePane()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Torrents)
