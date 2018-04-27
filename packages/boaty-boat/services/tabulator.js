import Rx from 'rxjs'
import screen from '@boaty/boat/services/screen'
import logger from '@boaty/boat/utils/logger'

let current = 0
const components = []
const subject = new Rx.Subject()

screen.key(['tab'], (ch, key) => {
  subject.next(components[++current % components.length])
  logger.broadcast('Focus', components[current % components.length])
})

const tabulator = {
  register: (component, autofocus = false) => {
    components.push(component)

    if (autofocus) {
      setTimeout(() => subject.next(component), 200)
    }

    logger.broadcast('Register', component)
    return subject.filter(next => next === component)
  },
  rescind: component => components.splice(components.indexOf(component), 1),
  push: component => subject.next(component),
  listen: () => subject
}

export default tabulator
