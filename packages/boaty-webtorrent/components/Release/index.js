import { connect } from 'react-redux'
import { selectTorrent } from '@boaty/webtorrent/store/ducks/torrents'
import Release from './presentational'

const mapStateToProps = (state) => ({
  name: (state.torrents.torrents.entities[state.torrents.torrents.result[state.torrents.selected]] || {}).name,
})

export default connect(
  mapStateToProps,
)(Release)
