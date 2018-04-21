// Actions
export const INIT = 'boaty/webtorrent/@@INIT'
export const FREEZE_PANE = 'boaty/webtorrent/FREEZE_PANE'
export const UNFREEZE_PANE = 'boaty/webtorrent/UNFREEZE_PANE'

// Reducer
const INITIAL = {
  frozen: false
}

export function reducer (state = INITIAL, action = {}) {
  switch (action.type) {
    case FREEZE_PANE:
      return {
        ...state,
        frozen: true,
      }
    case UNFREEZE_PANE:
      return {
        ...state,
        frozen: false,
      }
    default:
      return state
  }
}

// Actions Creators
export const initPane = () => ({
  type: INIT,
})

export const freezePane = () => ({
  type: FREEZE_PANE,
})

export const unfreezePane = () => ({
  type: UNFREEZE_PANE,
})
