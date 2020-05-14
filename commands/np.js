const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, _args) => {
  message.delete()
  if (!servers[message.guild.id].player) return
  if (!servers[message.guild.id].queue[0]) return
  const embed = new MessageEmbed()
  let s = Math.round(servers[message.guild.id].player.state.position / 1000)
  const a = servers[message.guild.id].queue[0].info.length.split(':')
  const length = parseInt(a[0]) * 60 + parseInt(a[1])
  const c = s * 19 / length
  const cr = (length - s) * 19 / length
  embed.setColor(`#${ ((1 << 24) * Math.random() | 0).toString(16) }`)
  embed.setTitle(`${ servers[message.guild.id].queue[0].info.title }`)
  embed.addField('Current play time: ', `${ '▬'.repeat(Math.floor(c)) }🔵${ '▬'.repeat(Math.floor(cr)) } ${ (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s }/${ servers[message.guild.id].queue[0].info.length }`)
  embed.setURL(`${ servers[message.guild.id].queue[0].info.image.indexOf('scdn') > 1 ? servers[message.guild.id].queue[0].spotifyURL : servers[message.guild.id].queue[0].info.uri }`)
  message.channel.send(embed).then(e => setTimeout(() => e.delete(), 10000))
}
exports.help = {
  name: '`np`',
  description: 'Info about track that is playing now',
  usage: 'np'
}
