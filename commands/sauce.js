const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

const mal = require('../utils/mal')
const colors = require('../utils/color')

exports.run = (client, message, args) => {
  let url = message.attachments.first()
  if (url) url = url.url
  else url = args[0]
  fetch(`https://trace.moe/api/search?url=${ url }`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(async result => {
      if (!result.docs) {
        message.channel.send("Sorry, I can't find sauce. Please, try another picture")
        return 0
      }
      console.log(result.docs)
      if (result.docs[0]) {
        let el = result.docs[0]
        let s = Math.round(el.from)
        let MAL_RES
        mal.search(el.title_romaji).then(r => { MAL_RES = r[0] }).catch(err => {
          message.channel.send('Sorry! Some internal troubles :/')
          return err
        })
        MAL_RES = MAL_RES[0]
        console.log(MAL_RES)
        const embed = new MessageEmbed()
          .setTitle(`${ el.title_native } | ${ el.title_romaji }`)
          .setImage(MAL_RES.image_url)
          .setAuthor('trace.moe')
          .setColor(colors.getDominant(MAL_RES.image_url))
          .setURL(MAL_RES.url)
          .setDescription(MAL_RES.synopsis)
          .addField('__**Rating:**__ ', `**${ MAL_RES.score }**`)
          .addField('__**Timestamp:**__ ', `**${ (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s }**`)
        message.channel.send(embed).catch(e => console.log(e.message))
      }
      return 0
    })
}
exports.help = {
  name: '`sauce`',
  description: 'Find anime by picture',
  usage: 'sauce `url` or attach a picture'
}
