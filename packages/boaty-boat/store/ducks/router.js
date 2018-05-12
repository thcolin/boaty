import { combineEpics } from 'redux-observable'
import Rx from 'rxjs'
import screen from '@boaty/boat/services/screen'
import * as appDuck from '@boaty/boat/store/ducks/app'
import logger from '@boaty/boat/utils/logger'

// Actions
export const REGISTER_ROUTE = 'boaty/boat/REGISTER_ROUTE'
export const FOCUS_ROUTE = 'boaty/boat/FOCUS_ROUTE'
export const RESCIND_ROUTE = 'boaty/boat/RESCIND_ROUTE'

// Reducer
const INITIAL = {
  focused: '',
  routes: []
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case REGISTER_ROUTE:
      return {
        ...state,
        routes: [action.uri].concat(state.routes)
      }
    case FOCUS_ROUTE:
      return {
        ...state,
        focused: action.uri
      }
    case RESCIND_ROUTE:
      return {
        ...state,
        routes: [].concat(state.routes).splice(state.routes.indexOf(action.uri), 1)
      }
    default:
      return state
  }
}

// Actions Creators
export const registerRoute = (uri) => ({
  type: REGISTER_ROUTE,
  uri
})

export const focusRoute = (uri) => ({
  type: FOCUS_ROUTE,
  uri
})

export const rescindRoute = (uri) => ({
  type: RESCIND_ROUTE,
  uri
})

// Epics
export const epic = combineEpics(
  focusRouteEpic,
)

export function focusRouteEpic(action$, store) {
  const tab$ = new Rx.Subject()
  screen.key(['S-tab', 'tab'], (ch, key) => tab$.next({ ch, key }))

  return action$.ofType(appDuck.INIT)
    .mergeMap(() => tab$)
    .map((e) => {
      let routes = store.getState().router.routes
      let previous = Math.max(0, routes.indexOf(store.getState().router.focused))
      let next = ((previous || routes.length) + (e.key.shift ? 1 : -1)) % routes.length
      logger.spawn('Focus', routes[next])
      return focusRoute(routes[next])
    })
}
