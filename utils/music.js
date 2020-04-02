/* eslint-disable consistent-return */
/* eslint-disable no-console */
const ytdl = require('ytdl-core');
const youtube = require('./yt_music');
const VOICE_API = require('./voice_api');
const playlist = require('./playlist_yt');
const spotify = require('./spotify');
const config = require('../config.json');
// Pattern for url check
const URL_PATTERN = /^(?:\w+:)?\/\/(\S+)$/;
module.exports = async (client, message) => {
  message.delete();
  try {
    await VOICE_API.join(client, message);
  } catch (e) {
    if (e.message === 'NO_CHANNEL') message.reply('You need to join a voice channel first!').then((a) => setTimeout(() => a.delete(), 2000));
    else console.error(e);
    return e;
  }
  const args = message.content.trim().split(/ +/g);
  if (args.indexOf(`${config.prefix}p`) > -1) {
    playlist.parse(client, message, args);
    return 0;
  }
  if (!URL_PATTERN.test(message.content)) {
    youtube.sr(client, message);
    return 0;
  }
  if (ytdl.validateURL(message.content)) {
    youtube.queue(client, message);
    return 0;
  }
  if (message.content.indexOf('spotify') > -1) {
    spotify.play(client, message);
    return 0;
  }
};
