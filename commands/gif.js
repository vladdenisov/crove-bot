const giphy = require('giphy-api')()
const { MessageAttachment } = require('discord.js')

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
  for (let i = 0; i < args.length; i++) {
    if (args[i].includes('<@')) args.splice(i, 1)
  }
  giphy.search(args.join(' '), (err, res) => {
    if (err) return
    if (!res.data[0]) return
    const rand = Math.round(0 - 0.5 + Math.random() * (res.data.length - 2))
    const attachment = new MessageAttachment(`https://i.giphy.com/media/${ res.data[rand].id }/giphy.gif`)
    message.channel.send({ content: message.mentions.users.first() ? `<@${ message.mentions.users.first().id }>` : '', files: [attachment] })
  })
}
exports.help = {
  name: '`gif`',
  description: 'Search gifs on `giphy`',
  usage: 'gif `query`'
}
