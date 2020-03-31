/* eslint-disable no-console */
/* eslint-disable global-require */
// Include all dependencies
const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
// Include config file
const config = require('./config.json');
// Include utils files
const RUN_MUSIC = require('./utils/music');
// Initialize Discord client
const client = new Discord.Client();
// Initialize commands enmap
client.commands = new Enmap();
// Create global object with servers
global.servers = {};
// Console.log that bot is ready and set bot activity
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.activity);
});
// Load all files with commands
fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    // eslint-disable-next-line import/no-dynamic-require
    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
  return 0;
});
// Add music channel when added
client.on('guildCreate', (guild) => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  guild.channels.create('music_req', 'text').then((channel) => {
    // Create embed message
    const eEmbed = new Discord.MessageEmbed()
      .setColor('#0652DD')
      .setTitle('Music Bot')
      .setAuthor('Music')
      .setDescription('Playing Music')
      .setThumbnail('https://cdn.discordapp.com/avatars/573460427753914368/5f6f60497f371261922916793ffbead0.png')
      .addField('Now Playing', 'Nothing')
      .addBlankField()
      .addField('Send link here to play something.', 'Waiting...');
    // Send messages
    channel.send(eEmbed).then((message) => {
      message.react('⏭').then(() => message.react('⏯')).then(() => message.react('⏹'));
    });
    channel.send('***Queue List:***');
  });
  // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
// Launch command by message
client.on('message', (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  // Ignore PM
  if (!message.guild) return;
  // Ignore messages without prefix
  if (message.content.indexOf(config.prefix) !== 0) {
    // Except for messages in "music_req" channel. Launch Music command
    if (message.channel.name === 'music_req') {
      RUN_MUSIC(client, message, ['message']);
      return;
    }
    return;
  }
  // Take args from message
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  // Make command lowercased
  const command = args.shift().toLowerCase();
  // See if this command exists
  const cmd = client.commands.get(command);
  if (!cmd) return;
  // Run command
  cmd.run(client, message, args);
});
// Final bot login
client.login(config.token);
