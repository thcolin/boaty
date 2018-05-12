import { combineReducers } from 'redux'
import { reducer as pane, initPane } from '@boaty/webtorrent/store/ducks/pane'
import { reducer as torrents, epic as torrentsEpic } from '@boaty/webtorrent/store/ducks/torrents'
import { reducer as websocket, epic as websocketEpic } from '@boaty/webtorrent/store/ducks/websocket'

export const reducer = combineReducers({
  pane,
  torrents,
  websocket,
})

export const epics = [
  torrentsEpic,
  websocketEpic,
]

export const bootstrap = [
  initPane()
]
