'use strict'
const texts = require('../utils/miscellaneous/8ball')
const tts = require('../utils/api/tts')

exports.run = async (client, message, args) => {
  if (!args[0]) {
    message.reply('Please, Ask a question.')
  }
  let lang = 'en'
  if (args[0] === 'ru') lang = 'ru'
  const random = Math.round(0 - 0.5 + Math.random() * (texts[lang].length - 1))
  let text = texts[lang][random]
  if (message.member.voice.channel && lang === 'en') {
    args.push('?!\n' + text)
    await tts.speak(client, message, args.join(' '))
  }
  message.reply(text)
}

exports.help = {
  name: '`8ball`',
  description: 'Ask a question to magic ball',
  usage: '8ball <your question>'
}
