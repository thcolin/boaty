import Rx from 'rxjs'
import screen from '@boaty/boat/singletons/screen'
import logger from '@boaty/boat/utils/logger'

let current = 0
const components = []
const subject = new Rx.Subject()

screen.key(['tab'], (ch, key) => {
  subject.next(components[++current % components.length])
  logger.broadcast('Focus', components[current % components.length])
})

const tabulator = {
  register: component => {
    components.push(component)
    return subject.filter(next => next === component)
  },
  push: component => subject.next(component)
}

export default tabulator
