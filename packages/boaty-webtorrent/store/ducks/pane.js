import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import '@boaty/webtorrent/utils/rxjs/operator/pausableBuffered'
import websocket from '@boaty/webtorrent/store/websocket'
import boatStore from '@boaty/boat/store'
import * as appDuck from '@boaty/boat/store/ducks/app'
import actions from '@boaty/webtorrent/actions'
import logger from '@boaty/boat/utils/logger'

// Actions
export const INIT = 'boaty/webtorrent/@@INIT'
export const SUCCESS_SOCKET = 'boaty/webtorrent/SUCCESS_SOCKET'
export const FAILURE_SOCKET = 'boaty/webtorrent/FAILURE_SOCKET'
export const FREEZE_PANE = 'boaty/webtorrent/FREEZE_PANE'
export const UNFREEZE_PANE = 'boaty/webtorrent/UNFREEZE_PANE'

// Reducer
const INITIAL = {
  online: false,
}

export function reducer (state = INITIAL, action = {}) {
  logger.broadcast('Redux', action.type)

  switch (action.type) {
    case SUCCESS_SOCKET:
      return {
        online: true,
      }
    case FAILURE_SOCKET:
      return {
        online: false,
      }
    default:
      return state
  }
}

// Actions Creators
export const initPane = () => ({
  type: INIT,
})

export const successSocket = () => ({
  type: SUCCESS_SOCKET,
})

export const failureSocket = () => ({
  type: FAILURE_SOCKET,
})

export const freezePane = () => ({
  type: FREEZE_PANE,
})

export const unfreezePane = () => ({
  type: UNFREEZE_PANE,
})

// Epics
export const epic = combineEpics(
  subscribeWebsocketEpic,
  fetchStatsEpic,
  amendPaneEpic,
)

export function subscribeWebsocketEpic(action$, store) {
  return action$.ofType(INIT)
    .do(() => boatStore.dispatch(appDuck.registerPane('webtorrent', store.getState().pane)))
    .mergeMap(() => websocket.connect().pausableBuffered(action$
      .filter(action => [FREEZE_PANE, UNFREEZE_PANE].includes(action.type))
      .map(action => action.type === FREEZE_PANE)
    ))
}

export function fetchStatsEpic(action$) {
  return action$.ofType(SUCCESS_SOCKET)
    .do(() => websocket.dispatch(actions.observeStats()))
    .mergeMap(() => Rx.Observable.never())
}

export function amendPaneEpic(action$, store) {
  return action$
    .filter(action => [actions.FILL_STATS, SUCCESS_SOCKET, FAILURE_SOCKET].includes(action.type))
    .do(action => boatStore.dispatch(
      appDuck.amendPane('webtorrent', Object.assign({}, store.getState().pane, action.stats))
    ))
    .mergeMap(() => Rx.Observable.never())
}
