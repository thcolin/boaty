import React, { Component } from 'react'
import Rx from 'rxjs'
import oleoo from 'oleoo'
import logger from '@boaty/boat/utils/logger'

const COMPONENT = 'webtorrent/release'
const style = (state = {}, props = {}) => ({
  container: {
    top: props.style.top,
    height: props.style.height,
    width: '100%',
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: props.focused ? 'blue' : 'grey'
      },
    }
  },
  list: {
    height: props.opened ? '100%-2' : 0,
    width: '100%-2',
    fg: 'white',
    align: 'left',
    noCellBorders: true,
    style: {
      cell: {
        selected: {
          bold: true
        }
      },
    }
  }
})

export default class Release extends Component {
  componentDidUpdate(props, state) {
    if (!props.focused && this.props.focused) {
      this.refs.self.focus()
    }
  }

  shapize (name) {
    const width = Math.max(0, ((this.refs.self || {}).width || 0) - 4)

    if (!name) {
      return [['']]
    }

    const release = oleoo.parse(name)
    let rows, pad

    if (release.score < 2) {
      pad = 9
      rows = [
        ['{bold}Torrent{/bold}', name],
        ['{bold}Sorry..{/bold}', 'Extension {underline}oleoo{/underline} didn\'t succeed to parse selected torrent']
      ]
    } else {
      pad = 12
      rows = [
        ['{bold}Torrent{/bold}', name],
        ['{bold}Type{/bold}', { movie: 'Movie', tvshow: 'TV Show' }[release.type]],
        ['{bold}Title{/bold}', release.title],
        ['{bold}Year{/bold}', (release.year || new Date().getFullYear().toString())],
        ['{bold}Resolution{/bold}', (release.resolution || 'SD')],
        ['{bold}Language{/bold}', release.language],
        ['{bold}Source{/bold}', (release.source || '{grey-fg}Unknown{/grey-fg}')],
        ['{bold}Encoding{/bold}', (release.encoding || '{grey-fg}Unknown{/grey-fg}')],
        ['{bold}Dub{/bold}', (release.dub || '{grey-fg}Unknown{/grey-fg}')],
      ]

      if (release.flags && release.flags.length) {
        rows.push(['{bold}Flags{/bold}', release.flags.join(', ')])
      }

      if (release.type === 'tvshow' && release.season) {
        rows.push(['{bold}Season{/bold}', release.season.toString().padStart(2, '0')])
      }

      if (release.type === 'tvshow' && release.episode) {
        rows.push(['{bold}Episode{/bold}', release.episode.toString().padStart(2, '0')])
      }

      rows.push(['{bold}Score{/bold}', `${release.score}/8`])
      rows.push(['{bold}Generated{/bold}', release.generated])

    }

    return rows.map(row => {
      row[1] = row[1].padEnd(width - pad, ' ')
      return row
    })
  }

  render () {
    const { name, uri } = this.props
    const rows = this.shapize(name)
    logger.ignore('Render', uri, [this.props.name])

    return (
      <box label="Release" {...style(this.state, this.props).container}>
        <listtable
          ref="self"
          keys={true}
          scroll={true}
          tags={true}
          rows={rows}
          {...style(this.state, this.props).list}
        />
      </box>
    )
  }
}
