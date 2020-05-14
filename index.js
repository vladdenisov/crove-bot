'use strict'
/* eslint-disable no-console */
/* eslint-disable global-require */
// Include all dependencies
const Discord = require('discord.js')
const fs = require('fs')
const Enmap = require('enmap')
const { Manager } = require('@lavacord/discord.js')

// Include config file
const config = require('./config.json')
// Include utils files
const music = require('./utils/music/music')
// Initialize Discord client
const client = new Discord.Client({
  partials: ['REACTION', 'MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'] }
})
// Initialize commands enmap
client.commands = new Enmap()
// Create global object with servers
global.servers = {}
// Console.log that bot is ready and set bot activity
client.on('ready', async () => {
  console.log(`Logged in as ${ client.user.tag }!`)
  client.user.setActivity(config.activity)
  const nodes = [
    { id: 'default', host: 'localhost', port: 2333, password: 'youshallnotpass' }
  ]
  client.manager = new Manager(client, nodes, {
    user: client.user.id, // Client id
    shards: (client.shard && client.shard.count) || 1
  })
  client.manager.on('ready', node => console.log(`${ node.host }: Is ready`))
  client.manager.on('disconnect', (node, event) => console.log(`${ node.host }: Disconnected with code ${ event.code } and reason ${ event.reason || 'No Reason Specified' }`))
  client.manager.on('error', (node, error) => console.error(node.host, error))
  client.manager.connect()
})
// Load all files with commands
fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    // eslint-disable-next-line import/no-dynamic-require
    // eslint-disable-next-line security/detect-non-literal-require
    const props = require(`./commands/${ file }`)
    const commandName = file.split('.')[0]
    console.log(`Attempting to load command ${ commandName }`)
    client.commands.set(commandName, props)
  })
  return 0
})
// Add music channel when added
client.on('guildCreate', guild => {
  console.log(`New guild joined: ${ guild.name } (id: ${ guild.id }). This guild has ${ guild.memberCount } members!`)
  guild.channels.create('music_req', 'text').then(channel => {
    // Create embed message
    const eEmbed = new Discord.MessageEmbed()
      .setColor('#0652DD')
      .setTitle('Music Bot')
      .setAuthor('Music')
      .setDescription('Playing Music')
      .setThumbnail(client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Now Playing', value: 'Nothing' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Send link here to play something.', value: 'Waiting...' }
      )
    // Send messages
    channel.send(eEmbed).then(message => {
      message.react('⏭').then(() => message.react('⏯')).then(() => message.react('⏹'))
    })
    channel.send('***Queue List:***')
  })
})
// Launch command by message
client.on('message', message => {
  // Ignore bot messages
  if (message.author.bot) return
  // Ignore PM
  if (!message.guild) return
  // Ignore messages without prefix
  if (message.content.indexOf(config.prefix) !== 0) {
    // Except for messages in "music_req" channel. Launch Music command
    if (message.channel.name === 'music_req') {
      music.run(client, message)
      return
    }
    return
  }
  // Take args from message
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  // Make command lowercased
  const command = args.shift().toLowerCase()
  // See if this command exists
  const cmd = client.commands.get(command)
  if (!cmd) return
  // Run command
  cmd.run(client, message, args)
})

// Catch UnhandledPromiseRejectionWarnings
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error))

// Final bot login
client.login(config.token)
