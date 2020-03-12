const ytpl = require('ytpl');
const youtube = require('./yt_music');

exports.parse = async (client, message, args) => {
  const url = args.map((el) => { if (ytpl.validateURL(el)) return el; return ''; }).join('');
  if (url === '') {
    message.reply('Send valid link to playlist!').then((e) => { setTimeout(() => { e.delete(); message.delete(); }, 5000); });
  }
  await ytpl(url, async (err, playlist) => {
    if (err) throw err;
    playlist.items.map(((el) => {
      servers[message.guild.id].queue.push({
        url: el.url_simple,
        title: el.title,
        length: el.duration,
        thumbnail: el.thumbnail,
      });
      return 0;
    }));
    message.channel.send(`Added ${playlist.total_items} songs from ${playlist.title}`).then((e) => { setTimeout(() => { e.delete(); message.delete(); }, 5000); });
    if (servers[message.guild.id].queue.length === playlist.items.length) {
      youtube.play(client, message);
      return;
    }
    await message.channel.messages.fetch().then((messages) => {
      const ARR_MESSAGES = Array.from(messages);
      const m = []; let
        t = 0;
      servers[message.guild.id].queue.map((el) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } return 0; });
      ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit(`***Queue List: \n*** ${m.join('')}`);
    });
  });
};
