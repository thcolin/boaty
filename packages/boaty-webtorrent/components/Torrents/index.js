import { connect } from 'react-redux'
import { selectTorrent } from '@boaty/webtorrent/store/ducks/torrents'
import { freezePane, unfreezePane } from '@boaty/webtorrent/store/ducks/pane'
import Torrents from './presentational'

const mapStateToProps = (state) => ({
  selected: state.torrents.selected,
  payload: state.torrents.torrents,
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (index) => dispatch(selectTorrent(index)),
  onFreeze: () => dispatch(freezePane()),
  onUnfreeze: () => dispatch(unfreezePane()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Torrents)
