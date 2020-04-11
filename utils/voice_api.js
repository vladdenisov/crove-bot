const { MessageEmbed } = require('discord.js');
const reactions = require('./reactions.js');

exports.join = async (client, message) => {
  if (message.member.voice.channel) {
    await message.member.voice.channel.join()
      .then((connection) => {
        if (!servers[message.guild.id]) {
          servers[message.guild.id] = {
            connection,
            dispatcher: null,
            queue: [],
            channel: message.channel.id,
          };
          reactions.hook(client, message);
        }
        if (servers[message.guild.id].connection === connection) return;
        servers[message.guild.id].connection = connection;
        servers[message.guild.id].queue = [];
      }).catch((e) => { throw (e); });
  } else {
    throw new Error('NO_CHANNEL');
  }
};
exports.leave = async (client, message) => {
  await message.member.voice.channel.leave();
  servers[message.guild.id].connection = {};
  servers[message.guild.id].dispatcher.destroy();
  message.channel.messages.fetch().then((messages) => {
    const ARR_MESSAGES = Array.from(messages);
    const eEmbed = new MessageEmbed()
      .setColor('#0652DD')
      .setTitle('Music Bot')
      .setAuthor('Music')
      .setDescription('Playing Music')
      .setThumbnail(client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Now Playing', value: 'Nothing' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Send link here to play something.', value: 'Waiting...' },
      );
    ARR_MESSAGES[ARR_MESSAGES.length - 1][1].edit(eEmbed);
    ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit('***Queue List:***');
  });
};
