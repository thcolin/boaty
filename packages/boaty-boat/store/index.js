import { combineReducers, compose, applyMiddleware, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { reducer as app, initApp } from '@boaty/boat/store/ducks/app'
import { reducer as router, epic as routerEpic } from '@boaty/boat/store/ducks/router'
import { reducer as webtorrent, epics as webtorrentEpics, bootstrap as webtorrentBootstrap } from '@boaty/webtorrent/store'

const reducer = combineReducers({
  app,
  router,
  webtorrent,
})

const epic = combineEpics(...[routerEpic].concat(webtorrentEpics))
const middleware = compose(applyMiddleware(createEpicMiddleware(epic)))
const store = createStore(reducer, middleware)

const bootstrap = [initApp()].concat(webtorrentBootstrap)
bootstrap.forEach(action => store.dispatch(action))

export default store
