import humanize from 'humanize'

humanize.speed = (speed) => `${humanize.filesize(speed)}/s`.replace(/bytes/g, 'b')
