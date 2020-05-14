const fetch = require('node-fetch')
const ytdl = require('ytdl-core')
const { MessageEmbed } = require('discord.js')

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
const timeConverter = s => (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
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
  song.info.length = timeConverter(Math.round(song.info.length / 1000))
  server.queue.push(song)
  if (!server.player.playing) await play(server, client, message)
  else {
    message.channel.messages.fetch().then(resp => {
      const messages = Array.from(resp)
      let t = 0
      const m = []
      server.queue.map(el => { if (t === 0) { t += 1 } else if (t > 20) { return 0 } else { t += 1; m.push(`${ t - 1 }. **${ el.info.title }** __Length: ${ el.info.length }__\n`) } return 0 })
      messages[messages.length - 2][1].edit(`***Queue List: \n*** ${ m.join('') }`)
    })
  }
  return 0
}

const play = async (server, client, message) => {
  await server.player.play(server.queue[0].track)
  server.player.once('error', console.error)
  server.player.once('end', data => {
    if (data.reason === 'REPLACED') return
    const shiffed = server.queue.shift()
    if (server.loop === true) {
      server.queue.push(shiffed)
    }
    if (!server.queue[0]) {
      voice.leave(client, message)
    }
    play(server, client, message)
  })
  try {
    // Edit main message and queue message
    message.channel.messages.fetch().then(resp => {
      const messages = Array.from(resp)
      let t = 0
      const m = []
      const eEmbed = new MessageEmbed()
        .setColor(`#${ ((1 << 24) * Math.random() | 0).toString(16) }`)
        .setTitle('Music Bot')
        .setAuthor('Music')
        .setDescription('Playing Music')
        .setImage(server.queue[0].info.image || client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .addField('Now Playing', `[${ server.queue[0].info.title }](${server.queue[0].info.uri})`)
        .addField('Length: ', server.queue[0].info.length)
      messages[messages.length - 1][1].edit(eEmbed)
      server.queue.map(song => { if (t === 0) { t += 1 } else if (t > 20) { return 0 } else { t += 1; m.push(`${ t - 1 }. **${ song.info.title }** __Length: ${ song.info.length }__\n`) } return 0 })
      messages[messages.length - 2][1].edit(`***Queue List: \n*** ${ m.join('') }`)
    })
  } catch (error) {
    // Handle errors
    console.error([error.message, error.name])
    message.channel.fetch(server.channel).send(error.message).then(e => setTimeout(() => e.delete(), 2000))
    server.queue.shift()
  }
}
