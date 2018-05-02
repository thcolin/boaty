import Rx from 'rxjs'
import screen from '@boaty/boat/services/screen'
import logger from '@boaty/boat/utils/logger'

let position = 0
const components = []
const subject = new Rx.Subject()

screen.key(['S-tab', 'tab'], (ch, key) => {
  position = ((position || components.length) + (key.shift ? -1 : 1)) % components.length
  subject.next(components[position])
  logger.spawn('Focus', components[position])
})

const router = {
  listen: () => subject,
  register: (component, autofocus = false) => {
    components.push(component)

    if (autofocus) {
      setTimeout(() => subject.next(component), 200)
    }

    logger.receive('Register', component)
    return subject.filter(next => next === component)
  },
  rescind: component => {
    components.splice(components.indexOf(component), 1)
  },
  push: component => {
    position = components.indexOf(component)
    subject.next(component)
  },
}

export default router
