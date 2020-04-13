const giphy = require('giphy-api')()
const { MessageAttachment } = require('discord.js')

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, _args) => {
  giphy.search('anime hug', (err, res) => {
    if (err) return
    if (!res.data[0]) return
    const rand = Math.round(0 - 0.5 + Math.random() * (res.data.length - 1))
    const attachment = new MessageAttachment(`https://i.giphy.com/media/${ res.data[rand].id }/giphy.gif`)
    message.channel.send(message.mentions.users.first() ? `<@${ message.mentions.users.first().id }>` : '', attachment)
  })
}
