import { combineReducers, compose, applyMiddleware, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { reducer as pane, initPane } from '@boaty/webtorrent/store/ducks/pane'
import { reducer as torrents, epic as torrentsEpic } from '@boaty/webtorrent/store/ducks/torrents'

const reducer = combineReducers({
  pane,
  torrents,
})

const epic = combineEpics(
  torrentsEpic
)

const middleware = compose(applyMiddleware(createEpicMiddleware(epic)))
const store = createStore(reducer, middleware)

store.dispatch(initPane())

export default store