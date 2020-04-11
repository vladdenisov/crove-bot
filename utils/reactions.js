/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// File to handle Reactions changes
const VOICE_API = require('./voice_api');

const handleReaction = async (client, message, reaction) => {
  const server = servers[message.guild.id];
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
      return;
    }
  }
  if (reaction.message.id !== reaction.message.channel.messages.cache.last().id) return;
  if (!reaction.message.author.bot) return;
  if (reaction.emoji.name === '⏭') {
    server.dispatcher.end();
  }
  if (reaction.emoji.name === '⏹') {
    VOICE_API.leave(client, message);
  }
  if (reaction.emoji.name === '⏯') {
    if (!server.dispatcher.isPaused) {
      server.dispatcher.isPaused = true; server.dispatcher.pause();
    } else {
      server.dispatcher.isPaused = false;
      server.dispatcher.resume();
    }
  }
};
exports.hook = async (client, message) => {
  client.on('messageReactionAdd', async (reaction, _user) => {
    handleReaction(client, message, reaction);
  });
  client.on('messageReactionRemove', async (reaction, _user) => {
    handleReaction(client, message, reaction);
  });
};
