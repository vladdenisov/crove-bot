const ytpl = require('ytpl');
const youtube = require('./yt_music');

exports.parse = async (client, message, args) => {
    const url = args.map(el => { if (ytpl.validateURL(el)) return el; }).join("");
    if (url === "") {
        message.reply("Send valid link to playlist!").then(e => { setTimeout(() => { e.delete(); message.delete(); }, 5000); });
    }
    await ytpl(url, async (err, playlist) => {
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
            return;
        }
        await message.channel.messages.fetch().then((messages) => {
            messages = Array.from(messages);
            let secMsg = messages[messages.length - 2][1];
            let m = [], t = 0;
            servers[message.guild.id].queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } });
            secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
        });
    });
};