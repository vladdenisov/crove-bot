// File to handle Reactions changes
const VOICE_API = require('./voice_api');

exports.hook = async (client, message) => {
  client.on('raw', (event) => {
    const server = servers[message.guild.id];
    const mRCH = message.guild.channels.find((channel) => channel.name === 'music_req');
    if ((event.t === 'MESSAGE_REACTION_ADD' || event.t === 'MESSAGE_REACTION_REMOVE') && parseInt(mRCH.id, 10) === parseInt(event.d.channel_id, 10)) {
      if (message.guild.members.get(event.d.user_id).user.bot) return;
      if (event.d.emoji.name === '⏭') {
        server.dispatcher.end();
      }
      if (event.d.emoji.name === '⏹') {
        VOICE_API.leave(client, message);
      }
      if (event.d.emoji.name === '⏯') {
        if (!server.dispatcher.isPaused) {
          server.dispatcher.isPaused = true; server.dispatcher.pause();
        } else {
          server.dispatcher.isPaused = false;
          server.dispatcher.resume();
        }
      }
    }
  });
};
