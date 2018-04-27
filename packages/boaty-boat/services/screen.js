import blessed from 'blessed'
import context from '@boaty/boat/services/context'

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: `${context.name}`
})

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0))

export default screen
