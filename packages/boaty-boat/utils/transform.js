import { createElement } from 'react'
import WebTorrent from '@boaty/webtorrent'

const components = {
  '@boaty/webtorrent': WebTorrent,
}

function transform(elements) {
  if (Array.isArray(elements)) {
    return elements.map(el => createElement(
      el.component && components[el.component] ? components[el.component] : el.type,
      el.props || {},
      ...transform(el.children || [])
    ))
  } else {
    return elements
  }
}

export default transform
