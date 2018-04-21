import { combineReducers, createStore } from 'redux'
import { reducer as app, initApp } from '@boaty/boat/store/ducks/app'

const reducer = combineReducers({ app })

const store = createStore(reducer)

store.dispatch(initApp())

export default store
