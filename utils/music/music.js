const fetch = require('node-fetch')
const ytdl = require('ytdl-core')

const voice = require('../api/voice')
exports.songs = async (server, search) => {
  const node = { host: 'localhost', port: 2333, password: 'youshallnotpass' }

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const params = new URLSearchParams()
  params.append('identifier', search)

  return fetch(`http://${ node.host }:${ node.port }/loadtracks?${ params }`, { headers: { Authorization: node.password } })
    .then(res => res.json())
    .then(data => data.tracks)
    .catch(err => {
      console.error(err)
      return null
    })
}
exports.run = async (client, message) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  const URL_PATTERN = /^(?:\w+:)?\/\/(\S+)$/
  const args = message.content.trim().split(/ +/g)
  message.delete()
  try {
    await voice.join(client, message)
  } catch (e) {
    if (e.message === 'NO_CHANNEL') message.reply('You need to join a voice channel first!').then(a => setTimeout(() => a.delete(), 2000))
    else console.error(e)
    return e
  }
  let song = ''
  const server = servers[message.guild.id]
  if (!URL_PATTERN.test(message.content)) [song] = await this.songs(servers[message.guild.id], `ytsearch:${ args.join(' ') }`)
  else [song] = await this.songs(servers[message.guild.id], `${ args.join(' ') }`)
  if (!song) return 0
  if (song.info.uri.includes('youtube')) {
    const info = await ytdl.getBasicInfo(song.info.uri)
    song.info.image = info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url
  }
  server.queue.push(song)
  if (!server.player.playing) await play(server)
  console.log(server.queue)
  return 0
}

const play = async server => {
  await server.player.play(server.queue[0].track)
  server.player.once('error', console.error)
  server.player.once('end', data => {
    if (data.reason === 'REPLACED') return
    const shiffed = server.queue.shift()
    if (server.loop === true) {
      server.queue.push(shiffed)
    }
    play(server)
  })
}
