import humanize from 'humanize'

humanize.speed = (speed) => `${humanize.filesize(speed)}/s`.replace(/bytes/g, 'b')
humanize.duration = (ms = 0) => {
  return [
		{ value: (Math.floor(ms / 86400000)), suffix: ' days' },
		{ value: (Math.floor(ms / 3600000) % 24), suffix: ' hours' },
		{ value: (Math.floor(ms / 60000) % 60), suffix: ' min' },
		{ value: (Math.floor(ms / 1000) % 60), suffix: 's' },
	]
  .filter(obj => obj.value)
  .map((obj, index, arr) => `${(index === arr.length - 1 ? obj.value.toString().padStart(2, '0') : obj.value)}${obj.suffix}`)
  .join(' ')
}
