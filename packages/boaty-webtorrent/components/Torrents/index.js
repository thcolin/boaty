import { connect } from 'react-redux'
import { partialTorrentsSelector } from '@boaty/webtorrent/store/ducks/torrents'
import { siftTorrents } from '@boaty/webtorrent/actions'
import { freezePane, unfreezePane } from '@boaty/webtorrent/store/ducks/pane'
import Torrents from './presentational'

const mapStateToProps = (state) => ({
  selected: state.torrents.selected,
  torrents: partialTorrentsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (index) => dispatch(siftTorrents(index)),
  onFreeze: () => dispatch(freezePane()),
  onUnfreeze: () => dispatch(unfreezePane()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Torrents)
