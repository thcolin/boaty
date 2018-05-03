import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import websocket from '@boaty/webtorrent/store/websocket'
import * as paneDuck from '@boaty/webtorrent/store/ducks/pane'
import actions from '@boaty/webtorrent/actions'

// Reducer
export const INITIAL = {
  selected: 0,
  entities: {},
  result: []
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case actions.FILL_TORRENTS:
      return {
        selected: 0,
        entities: action.entities,
        result: action.result,
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
    case actions.SIFT_TORRENTS:
      return {
        ...state,
        selected: action.index,
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
  state.torrents.result.map(hash => ({
    done: state.torrents.entities[hash].done,
    paused: state.torrents.entities[hash].paused,
    name: state.torrents.entities[hash].name,
    downloadSpeed: state.torrents.entities[hash].downloadSpeed,
    uploadSpeed: state.torrents.entities[hash].uploadSpeed,
    progress: state.torrents.entities[hash].progress,
    total: state.torrents.entities[hash].total,
    path: state.torrents.entities[hash].path,
    timeRemaining: state.torrents.entities[hash].timeRemaining,
  }))
)

export const siftedTorrentsSelector = (state) => (
  state.torrents.entities[state.torrents.result[state.torrents.selected]]
)

// Epics
export const epic = combineEpics(
  fetchTorrentsEpic,
  observeTorrentsEpic,
)

export function fetchTorrentsEpic(action$) {
  return action$.ofType(paneDuck.SUCCESS_SOCKET)
    .do(() => websocket.dispatch(actions.fetchTorrents()))
    .mergeMap(() => Rx.Observable.never())
}

export function observeTorrentsEpic(action$) {
  return action$.ofType(actions.FILL_TORRENTS)
    .do(() => websocket.dispatch(actions.observeTorrents()))
    .mergeMap(() => Rx.Observable.never())
}
