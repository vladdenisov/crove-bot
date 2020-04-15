'use strict'

const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const { watson } = require('../../config.json')
const VOICE_API = require('./voice')

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: watson.key
  }),
  url: watson.url
})

exports.speak = async (client, message, text, voice = 'en-US_AllisonV3Voice') => {
  const synthesizeParams = {
    text,
    accept: 'audio/ogg;codecs=opus',
    voice
  }
  textToSpeech.synthesize(synthesizeParams)
    .then(async audio => {
      await VOICE_API.join(client, message)
      servers[message.guild.id].dispatcher = servers[message.guild.id].connection.play(audio.result)
    })
    .catch(err => {
      console.log('error:', err)
    })
}
