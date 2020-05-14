
exports.run = (client, message, args) => {
  if (!message.member.voice.channel) return
  if (!servers[message.guild.id]) return
  if (!servers[message.guild.id].connection) return
}

exports.help = {
  name: '`seek`',
  description: 'Seek to video time',
  usage: 'seek `time`'
}
