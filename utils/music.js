const youtube = require('./yt_music');
const ytdl = require('ytdl-core');
const voice_api = require('./voice_api');
const playlist = require('./playlist_yt');
const config = require('../config.json');
//Pattern for url check
const url_pattern = /^(?:\w+:)?\/\/(\S+)$/;
module.exports = async (client, message) => {
    await voice_api.join(client, message);
    const args = message.content.trim().split(/ +/g);
    message.delete();
    if (args.indexOf(`${config.prefix}p` || args.indexOf(`p`))) {
        playlist.parse(client, message, args);
        return;
    }
    if (!url_pattern.test(message.content)) { message.reply("Send valid url").then(e => { setTimeout(() => { e.delete(); message.delete(); }, 5000); }); return; }
    if (ytdl.validateURL(message.content)) {
        youtube.queue(client, message);
    }
};