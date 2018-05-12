import logger from '@boaty/boat/utils/logger'

// Actions
export const INIT = 'boaty/boat/@@INIT'
export const REGISTER_PANE = 'boaty/boat/REGISTER_PANE'
export const AMEND_PANE = 'boaty/boat/AMEND_PANE'

// Reducer
const INITIAL = {
  panes: {}
}

export function reducer (state = INITIAL, action = {}) {
  logger.broadcast('Redux', action.type)

  switch (action.type) {
    case REGISTER_PANE:
      return {
        ...state,
        panes: {
          ...state.panes,
          [action.name]: action.payload
        }
      }
    case AMEND_PANE:
      return {
        ...state,
        panes: {
          ...state.panes,
          [action.name]: Object.assign({}, state.panes[action.name], action.payload)
        }
      }
    default:
      return state
  }
}

// Actions Creators
export const initApp = () => ({
  type: INIT,
})

export const registerPane = (name, payload) => ({
  type: REGISTER_PANE,
  name,
  payload,
})

export const amendPane = (name, payload) => ({
  type: AMEND_PANE,
  name,
  payload,
})

// Selectors
export const readySelector = (state) => !Object.keys(state.app.panes).length ? false : Object.keys(state.app.panes)
  .map(name => state.app.panes[name])
  .reduce((ready, pane) => ready * pane.ready, 1)

export const statsSelector = (state) => Object.keys(state.app.panes)
  .map(name => state.app.panes[name])
  .reduce((stats, pane) => ({
    down: stats.down + (pane.down || 0),
    up: stats.up + (pane.up || 0),
    ratio: stats.ratio + (pane.ratio || 0),
    total: stats.total + (pane.total || 0),
    done: stats.done + (pane.done || 0),
    connections: stats.connections.concat(pane.host ? [{ host: pane.host, port: pane.port }] : []),
  }), {
    down: 0,
    up: 0,
    ratio: 0,
    total: 0,
    done: 0,
    connections: [],
  })
