import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import websocket from '@boaty/webtorrent/store/websocket'
import * as websocketDuck from '@boaty/webtorrent/store/ducks/websocket'
import actions from '@boaty/webtorrent/actions'
import logger from '@boaty/boat/utils/logger'

// Reducer
export const INITIAL = {
  selected: 0,
  entities: {},
  result: []
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case websocketDuck.SUCCESS_WEBSOCKET:
    case websocketDuck.FAILURE_WEBSOCKET:
      return INITIAL
    case actions.FILL_TORRENTS:
      return {
        selected: 0,
        entities: action.entities,
        result: action.result,
      }
    case actions.SIFT_TORRENTS:
      return {
        ...state,
        selected: action.index,
      }
    case actions.ENHANCE_TORRENTS:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.torrent.hash]: action.torrent
        },
        result: [action.torrent.hash].concat(state.result)
      }
    case actions.AMEND_TORRENTS:
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.group
            .reduce((obj, differencies) => Object.assign(obj, {
              [differencies.hash]: Object.assign({}, state.entities[differencies.hash], differencies)
            }), {})
        }
      }
    case actions.TRUNCATE_TORRENTS:
      return {
        ...state,
        entities: Object.values(state.entities)
          .filter(torrent => torrent.hash !== action.hash)
          .reduce((entities, torrent) => Object.assign(entities, { [torrent.hash]: torrent }), {}),
        result: state.result.filter(hash => hash !== action.hash)
      }
    case actions.AMEND_TORRENT:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.differencies.hash]: Object.assign({}, state.entities[action.differencies.hash], action.differencies)
        }
      }
    default:
      return state
  }
}

// Selectors
export const partialTorrentsSelector = (state) => (
  state.webtorrent.torrents.result.map(hash => ({
    hash,
    done: state.webtorrent.torrents.entities[hash].done,
    stoped: state.webtorrent.torrents.entities[hash].stoped,
    name: state.webtorrent.torrents.entities[hash].name,
    downloadSpeed: state.webtorrent.torrents.entities[hash].downloadSpeed,
    uploadSpeed: state.webtorrent.torrents.entities[hash].uploadSpeed,
    progress: state.webtorrent.torrents.entities[hash].progress,
    total: state.webtorrent.torrents.entities[hash].total,
    path: state.webtorrent.torrents.entities[hash].path,
    timeRemaining: state.webtorrent.torrents.entities[hash].timeRemaining,
  }))
)

export const siftedTorrentsSelector = (state) => (
  state.webtorrent.torrents.entities[state.webtorrent.torrents.result[state.webtorrent.torrents.selected]]
)

// Epics
export const epic = combineEpics(
  fetchTorrentsEpic,
  observeTorrentsEpic,
  applyTorrentEPic,
)

export function fetchTorrentsEpic(action$) {
  return action$.ofType(websocketDuck.SUCCESS_WEBSOCKET)
    .do(() => websocket.dispatch(actions.fetchTorrents()))
    .mergeMap(() => Rx.Observable.never())
}

export function observeTorrentsEpic(action$) {
  return action$.ofType(actions.FILL_TORRENTS)
    .do(() => websocket.dispatch(actions.observeTorrents()))
    .mergeMap(() => Rx.Observable.never())
}

export function applyTorrentEPic(action$) {
  return action$
    .filter(action => [
      actions.PAUSE_TORRENT,
      actions.RESUME_TORRENT,
      actions.REMOVE_TORRENT,
      actions.DELETE_TORRENT,
    ].includes(action.type))
    .do(action => websocket.dispatch(action))
    .mergeMap(() => Rx.Observable.never())
}
