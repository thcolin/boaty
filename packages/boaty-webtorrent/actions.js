const actions = {}

// Stats
actions.OBSERVE_STATS = 'boaty/webtorrent/torrents/OBSERVE_STATS'
actions.FILL_STATS = 'boaty/webtorrent/torrents/FILL_STATS'

actions.observeStats = () => ({
  type: actions.OBSERVE_STATS
})

actions.fillStats = (stats) => ({
  type: actions.FILL_STATS,
  stats
})

// Torrents
actions.FETCH_TORRENTS = 'boaty/webtorrent/torrents/FETCH_TORRENTS'
actions.OBSERVE_TORRENTS = 'boaty/webtorrent/torrents/torrent/OBSERVE_TORRENTS'
actions.FILL_TORRENTS = 'boaty/webtorrent/torrents/FILL_TORRENTS'
actions.ENHANCE_TORRENTS = 'boaty/webtorrent/torrents/ENHANCE_TORRENTS'
actions.HARM_TORRENTS = 'boaty/webtorrent/torrents/HARM_TORRENTS'
actions.AMEND_TORRENTS = 'boaty/webtorrent/torrents/AMEND_TORRENTS'
actions.SIFT_TORRENTS = 'boaty/webtorrent/torrents/SIFT_TORRENTS'

actions.fetchTorrents = () => ({
  type: actions.FETCH_TORRENTS
})

actions.observeTorrents = () => ({
  type: actions.OBSERVE_TORRENTS
})

actions.fillTorrents = (torrents) => {
  const entities = torrents.reduce((obj, torrent) => Object.assign(obj, { [torrent.hash]: torrent }), {})

  return {
    type: actions.FILL_TORRENTS,
    entities: entities,
    result: Object.keys(entities)
  }
}

actions.enhanceTorrents = (torrent) => ({
  type: actions.ENHANCE_TORRENTS,
  torrent
})

actions.harmTorrents = (torrent) => ({
  type: actions.HARM_TORRENTS,
  torrent
})

actions.amendTorrents = (group) => ({
  type: actions.AMEND_TORRENTS,
  group
})

actions.siftTorrents = (index) => ({
  type: actions.SIFT_TORRENTS,
  index
})

// Torrent
actions.AMEND_TORRENT = 'boaty/webtorrent/torrents/torrent/AMEND_TORRENT'
actions.RESUME_TORRENT = 'boaty/webtorrent/torrents/torrent/RESUME_TORRENT'
actions.PAUSE_TORRENT = 'boaty/webtorrent/torrents/torrent/PAUSE_TORRENT'
actions.ASK_TORRENT = 'boaty/webtorrent/torrents/torrent/ASK_TORRENT'

actions.amendTorrent = (differencies) => ({
  type: actions.AMEND_TORRENT,
  differencies
})

actions.resumeTorrent = () => ({
  type: actions.RESUME_TORRENT,
})

actions.pauseTorrent = () => ({
  type: actions.PAUSE_TORRENT,
})

actions.askTorrent = (request) => ({
  type: actions.ASK_TORRENT,
  request
})

module.exports = actions
