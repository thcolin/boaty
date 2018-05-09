import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import '@boaty/webtorrent/utils/rxjs/operator/pausableBuffered'
import websocket from '@boaty/webtorrent/store/websocket'
import boatStore from '@boaty/boat/store'
import * as appDuck from '@boaty/boat/store/ducks/app'
import * as paneDuck from '@boaty/webtorrent/store/ducks/pane'
import actions from '@boaty/webtorrent/actions'

// Actions
export const SUCCESS_WEBSOCKET = 'boaty/webtorrent/websocket/SUCCESS_WEBSOCKET'
export const FAILURE_WEBSOCKET = 'boaty/webtorrent/websocket/FAILURE_WEBSOCKET'
export const FREEZE_WEBSOCKET = 'boaty/webtorrent/websocket/FREEZE_WEBSOCKET'
export const RELEASE_WEBSOCKET = 'boaty/webtorrent/websocket/RELEASE_WEBSOCKET'

// Reducer
const INITIAL = {
  online: false,
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case SUCCESS_WEBSOCKET:
      return {
        online: true,
      }
    case FAILURE_WEBSOCKET:
      return {
        online: false,
      }
    default:
      return state
  }
}

// Actions Creators
export const successWebsocket = () => ({
  type: SUCCESS_WEBSOCKET,
})

export const failureWebsocket = () => ({
  type: FAILURE_WEBSOCKET,
})

export const freezeWebsocket = () => ({
  type: FREEZE_WEBSOCKET,
})

export const releaseWebsocket = () => ({
  type: RELEASE_WEBSOCKET,
})

// Epics
export const epic = combineEpics(
  subscribeWebsocketEpic,
  fetchStatsEpic,
  amendPaneEpic,
)

export function subscribeWebsocketEpic(action$, store) {
  return action$.ofType(paneDuck.INIT)
    .do(() => boatStore.dispatch(
      appDuck.registerPane('webtorrent', { ready: store.getState().websocket.online })
    ))
    .mergeMap(() => websocket.connect().pausableBuffered(action$
      .filter(action => [FREEZE_WEBSOCKET, RELEASE_WEBSOCKET].includes(action.type))
      .map(action => action.type === FREEZE_WEBSOCKET)
    ))
}

export function fetchStatsEpic(action$) {
  return action$.ofType(SUCCESS_WEBSOCKET)
    .do(() => websocket.dispatch(actions.observeStats()))
    .mergeMap(() => Rx.Observable.never())
}

export function amendPaneEpic(action$, store) {
  return action$
    .filter(action => [actions.FILL_STATS, SUCCESS_WEBSOCKET, FAILURE_WEBSOCKET].includes(action.type))
    .do(action => boatStore.dispatch(
      appDuck.amendPane('webtorrent', Object.assign({ ready: store.getState().websocket.online }, action.stats))
    ))
    .mergeMap(() => Rx.Observable.never())
}
