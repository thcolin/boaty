import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import service from '@boaty/webtorrent/store/service'
import * as paneDuck from '@boaty/webtorrent/store/ducks/pane'

const INTERVAL = 1000

// Actions
export const FILL_TORRENTS = 'boaty/webtorrent/FILL_TORRENTS'
export const SELECT_TORRENT = 'boaty/webtorrent/SELECT_TORRENT'

// Reducer
export const INITIAL = {
  selected: 0,
  frozen: false,
  torrents: {
    entities: {},
    result: []
  }
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case FILL_TORRENTS:
      return {
        ...state,
        torrents: action.torrents
      }
    case SELECT_TORRENT:
      return {
        ...state,
        selected: action.index
      }
    default:
      return state
  }
}

// Actions Creators
export const selectTorrent = (index) => ({
  type: SELECT_TORRENT,
  index
})

export const fillTorrents = (torrents) => ({
  type: FILL_TORRENTS,
  torrents: {
    entities: torrents.reduce((obj, torrent) => Object.assign(obj, { [torrent.hash]: torrent }), {}),
    result: torrents.map(torrent => torrent.hash)
  }
})

// Epics
export const epic = combineEpics(
  initPaneEpic,
)

export function initPaneEpic(action$, store) {
  return action$.ofType(paneDuck.INIT)
    .mergeMap(() => Rx.Observable
      .timer(0, INTERVAL)
      .filter(() => !store.getState().pane.frozen)
      .mergeMap(() => service.torrents())
      .map(torrents => fillTorrents(torrents))
      .catch(e => Rx.Observable.never())
    )
}
