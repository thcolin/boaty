// Actions
export const INIT = 'boaty/boat/@@INIT'

// Reducer
const INITIAL = {}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}

// Actions Creators
export const initApp = () => ({
  type: INIT,
})
