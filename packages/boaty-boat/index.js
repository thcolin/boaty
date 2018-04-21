import 'babel-polyfill'
import React from 'react'
import { render } from 'react-blessed'
import { Provider } from 'react-redux'
import App from '@boaty/boat/components/App'
import Safer from '@boaty/boat/components/Safer'
import store from '@boaty/boat/store'
import screen from '@boaty/boat/singletons/screen'
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
