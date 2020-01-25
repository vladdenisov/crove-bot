const ytpl = require('ytpl');
const youtube = require('./yt_music');

exports.parse = async (client, message, args) => {
    const url = args.map(el => { if (ytpl.validateURL(el)) return el; }).join("");
    if (url === "") {
        message.reply("Send valid link to playlist!").then(e => { setTimeout(() => { e.delete(); message.delete(); }, 5000); });
    }
    await ytpl(url, (err, playlist) => {
        if (err) throw err;
        playlist.items.map((el => {
            servers[message.guild.id].queue.push({
                url: el.url_simple,
                title: el.title,
                length: el.duration,
                thumbnail: el.thumbnail
            });
        }));
        message.channel.send(`Added ${playlist.total_items} songs from ${playlist.title}`).then(e => { setTimeout(() => { e.delete(); message.delete(); }, 5000); });
        if (servers[message.guild.id].queue.length === playlist.items.length) {
            youtube.play(client, message);
        }
    });
};