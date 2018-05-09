import logger from '@boaty/boat/utils/logger'

// Actions
export const INIT = 'boaty/webtorrent/@@INIT'

// Reducer
const INITIAL = {}

export function reducer (state = INITIAL, action = {}) {
  logger.broadcast('Redux', action.type)

  switch (action.type) {
    default:
      return state
  }
}

// Actions Creators
export const initPane = () => ({
  type: INIT,
})
