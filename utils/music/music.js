const fetch = require('node-fetch')

const voice = require('../api/voice')
const getSongs = async (server, search) => {
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
  message.delete()
  try {
    await voice.join(client, message)
  } catch (e) {
    if (e.message === 'NO_CHANNEL') message.reply('You need to join a voice channel first!').then(a => setTimeout(() => a.delete(), 2000))
    else console.error(e)
    return e
  }
  const args = message.content.trim().split(/ +/g)
  const [song] = await getSongs(servers[message.guild.id], `ytsearch: ${ args.join(' ') }`)
  console.log(song)
  await servers[message.guild.id].player.play(song.track)
}
