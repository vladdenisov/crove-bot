const { MessageEmbed } = require('discord.js')

const color = require('../utils/api/color')

exports.run = async (client, message, args) => {
  let url = message.attachments.first()
  if (url) url = url.url
  else url = args[0]
  let c
  try {
    c = await color.getDominant(url)
  } catch (e) {
    message.channel.send("Sorry! Can't detect dominating color. Please, try another image.")
    return 0
  }
  const embed = new MessageEmbed()
    .setColor(c)
    .setTitle(`**${ c }**`)
    .setImage(`https://dummyimage.com/100x100/${ c.slice(1) }.jpg&text=+`)
  message.channel.send(embed).catch(e => console.error(e.message))
  return 0
}

exports.help = {
  name: '`color`',
  description: 'Get Dominating color of picture',
  usage: 'color `url` or attach a picture'
}
