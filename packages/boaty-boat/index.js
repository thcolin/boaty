import 'babel-polyfill'
import React from 'react'
import { render } from 'react-blessed'
import { Provider } from 'react-redux'
import App from '@boaty/boat/layout/App'
import Safer from '@boaty/boat/enhancers/Safer'
import store from '@boaty/boat/store'
import screen from '@boaty/boat/services/screen'
import '@boaty/boat/utils/humanize'
import logger from '@boaty/boat/utils/logger'

logger.launch('Booted !')

render((
  <Provider store={store}>
    <Safer>
      <App />
    </Safer>
  </Provider>
), screen)

// Keep app alive (?)
setInterval(() => {}, 1000)
