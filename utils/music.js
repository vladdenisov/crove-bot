const youtube = require('./yt_music.js');
const ytdl = require('ytdl-core');
const voice_api = require('./voice_api');
//Pattern for url check
const url_pattern = /^(?:\w+:)?\/\/(\S+)$/;
module.exports = async (client, message, args) => {
    await voice_api.join(client, message);
    console.log(url_pattern.test(message.content));
    message.delete();
    if (!url_pattern.test(message.content)) { message.reply("Send valid url").then(e => { setTimeout(() => { e.delete(); message.delete(); }, 5000); }); return; }
    if (ytdl.validateURL(message.content)) {
        youtube.queue(client, message);
    }
};