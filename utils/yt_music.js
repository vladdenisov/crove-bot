/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable max-len */
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { MessageEmbed } = require('discord.js');
const VOICE_API = require('./voice_api');
// Add song to server queue
exports.queue = async (client, message) => {
  const VIDEO_INFO = await ytdl.getBasicInfo(message.content).catch((err) => { console.log(err); });
  let s = VIDEO_INFO.length_seconds;
  servers[message.guild.id].queue.push({
    url: message.content,
    length: (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s, // This expression converts seconds to "h:m:s" format
    title: VIDEO_INFO.title,
    thumbnail: VIDEO_INFO.player_response.videoDetails.thumbnail.thumbnails[VIDEO_INFO.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
  });
  // If added song is first: then start playing
  if (!servers[message.guild.id].queue[1]) { exports.play(client, message); return; }
  // Else: edit queue message
  await message.channel.messages.fetch().then((messages) => {
    const ARR_MESSAGES = Array.from(messages);
    const m = []; let
      t = 0;
    servers[message.guild.id].queue.map((song) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${song.title}** __Length: ${song.length}__\n`); } return 0; });
    ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit(`***Queue List: \n*** ${m.join('')}`);
  });
};
// Search function for YouTube
exports.sr = async (client, message, query, data = '') => {
  if (!query) query = message.content;
  await ytsr(query, { limit: 4 }, async (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    let el;
    result.items.some((e) => { if (e.type === 'video') { el = e; } return 0; });
    servers[message.guild.id].queue.push({
      url: el.link,
      title: data !== '' ? `${data.artists.join(', ')} - ${data.name}` : el.title,
      length: el.duration,
      thumbnail: data !== '' ? data.cover : el.thumbnail,
      spotifyURL: data !== '' ? data.url : el.link,
    });
    if (data === '') {
      const VIDEO_INFO = await ytdl.getBasicInfo(el.link).catch((err) => { console.log(err); });
      servers[message.guild.id].queue[servers[message.guild.id].queue.length - 1].thumbnail = VIDEO_INFO.player_response.videoDetails.thumbnail.thumbnails[VIDEO_INFO.player_response.videoDetails.thumbnail.thumbnails.length - 1].url;
    }
    if (servers[message.guild.id].queue[1]) {
      await message.channel.messages.fetch().then((messages) => {
        const ARR_MESSAGES = Array.from(messages);
        const m = []; let
          t = 0;
        servers[message.guild.id].queue.map((song) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${song.title}** __Length: ${song.length}__\n`); } return 0; });
        ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit(`***Queue List: \n*** ${m.join('')}`);
      });
      return;
    }
    this.play(client, message);
  });
};
// Play first song in queue
exports.play = async (client, message) => {
  const server = servers[message.guild.id];
  try {
    server.dispatcher = server.connection.play(ytdl(server.queue[0].url, {
      filter: 'audioonly',
      // eslint-disable-next-line no-bitwise
      highWaterMark: 1 << 25, // To prevent unexpected end of video
    }));
    server.dispatcher.on('end', async () => {
      server.queue.shift();
      if (!server.queue[0]) { await VOICE_API.leave(client, message); return; }
      this.play(client, message);
    });
    server.dispatcher.on('error', (error) => {
      console.log(error);
      server.queue.shift();
      this.play(client, message);
    });
    // Edit main message and queue message
    message.channel.messages.fetch().then((messages) => {
      const ARR_MESSAGES = Array.from(messages);
      let t = 0; const m = [];
      const eEmbed = new MessageEmbed()
        .setColor(server.queue[0].thumbnail.indexOf('scdn') > 1 ? '#2ecc71' : '#f1c40f')
        .setTitle('Music Bot')
        .setAuthor('Music')
        .setDescription(server.queue[0].thumbnail.indexOf('scdn') > 1 ? "You've added song from spotify! It can sound not as you expect :)" : 'Playing Music')
        .setImage(server.queue[0].thumbnail)
        .addField('Now Playing', `[${server.queue[0].title}](${server.queue[0].thumbnail.indexOf('scdn') > 1 ? server.queue[0].spotifyURL : server.queue[0].url})`)
        .addField('Length: ', server.queue[0].length);
      ARR_MESSAGES[ARR_MESSAGES.length - 1][1].edit(eEmbed);
      server.queue.map((song) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${song.title}** __Length: ${song.length}__\n`); } return 0; });
      ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit(`***Queue List: \n*** ${m.join('')}`);
    });
  } catch (error) {
    // Handle errors
    console.error([error.message, error.name]);
    message.channel.send(error.message).then((e) => setTimeout(() => e.delete(), 2000));
    servers[message.guild.id].queue.shift();
  }
};
