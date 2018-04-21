import React, { Component } from 'react'
import oleoo from 'oleoo'

const COMPONENT = 'webtorrent/release'
const style = state => ({
  height: '100%',
  width: '100%',
  fg: 'white',
  align: 'left',
  noCellBorders: true,
  border: {
    type: 'line',
  },
  style: {
    border: {
      fg: 'grey'
    },
  }
})

export default class Release extends Component {
  shapize (name) {
    if (!name) {
      return [
        ['Loading...']
      ]
    }

    const release = oleoo.parse(name)

    if (release.score < 2) {
      return [
        ['{bold}Original{/bold}', name],
        ['{bold}Error{/bold}', 'No Release Informations available for this torrent, sorry !']
      ]
    }

    const rows = [
      ['{bold}Original{/bold}', name],
      ['{bold}Type{/bold}', { movie: 'Movie', tvshow: 'TV Show' }[release.type]],
      ['{bold}Title{/bold}', release.title],
      ['{bold}Year{/bold}', release.year || new Date().getFullYear().toString()],
      ['{bold}Resolution{/bold}', release.resolution || 'SD'],
      ['{bold}Language{/bold}', release.language],
      ['{bold}Source{/bold}', release.source || '{grey-fg}Unknown{/grey-fg}'],
      ['{bold}Encoding{/bold}', release.encoding || '{grey-fg}Unknown{/grey-fg}'],
      ['{bold}Dub{/bold}', release.dub || '{grey-fg}Unknown{/grey-fg}'],
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

    return rows
  }

  render () {
    const { name } = this.props
    const rows = this.shapize(name)

    return (
      <listtable
        // label="Release Informations"
        ref="self"
        tags={true}
        rows={rows}
        {...style(this.state)}
      />
    )
  }
}
