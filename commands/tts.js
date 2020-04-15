'use strict'
const tts = require('../utils/api/tts')

exports.run = (client, message, args) => {
  let voice
  if (!args[0].includes('_')) voice = 'en-US_AllisonV3Voice'
  else {
    voice = args[0]
    args.splice(0, 1)
  }
  tts.speak(client, message, args.join(' '), voice)
}

exports.help = {
  name: '`tts`',
  description: 'Translate text to speech, connect to voice channel to use it',
  usage: 'tts `text`'
}
