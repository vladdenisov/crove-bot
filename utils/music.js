const ytdl = require('ytdl-core');
const youtube = require('./yt_music');
const VOICE_API = require('./voice_api');
const playlist = require('./playlist_yt');
const config = require('../config.json');
// Pattern for url check
const URL_PATTERN = /^(?:\w+:)?\/\/(\S+)$/;
module.exports = async (client, message) => {
  await VOICE_API.join(client, message);
  const args = message.content.trim().split(/ +/g);
  message.delete();
  if (args.indexOf(`${config.prefix}p`) > -1) {
    playlist.parse(client, message, args);
    return;
  }
  if (!URL_PATTERN.test(message.content)) {
    youtube.sr(client, message);
    return;
  }
  if (ytdl.validateURL(message.content)) {
    youtube.queue(client, message);
  }
};
