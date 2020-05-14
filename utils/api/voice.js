const { MessageEmbed } = require('discord.js')

const reactions = require('./reactions.js')

exports.join = async (client, message) => {
  if (message.member.voice.channel) {
    if (!servers[message.guild.id]) {
      servers[message.guild.id] = {
        player: await client.manager.join({
          guild: message.guild.id, // Guild id
          channel: message.member.voice.channel.id, // Channel id
          node: 'default'
        }),
        queue: [],
        channel: message.channel.id
      }
      reactions.hook(client, message)
    }
    if (servers[message.guild.id].player) return
    servers[message.guild.id].queue = []
  } else {
    throw new Error('NO_CHANNEL')
  }
}
exports.leave = async (client, message) => {
  if (!message.member.voice.channel) return
  servers[message.guild.id].player.destroy()
  client.manager.leave(message.guild.id)
  message.channel.messages.fetch().then(messages => {
    const ARR_MESSAGES = Array.from(messages)
    const eEmbed = new MessageEmbed()
      .setColor('#0652DD')
      .setTitle('Music Bot')
      .setAuthor('Music')
      .setDescription('Playing Music')
      .setThumbnail(client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Now Playing', value: 'Nothing' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Send link here to play something.', value: 'Waiting...' }
      )
    ARR_MESSAGES[ARR_MESSAGES.length - 1][1].edit(eEmbed)
    ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit('***Queue List:***')
  })
}
