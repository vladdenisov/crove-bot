const { MessageEmbed } = require('discord.js')

const { prefix } = require('../config.json')

exports.run = (client, message, args) => {
  const embed = new MessageEmbed()
    .setColor('#e056fd')
  if (!args[0]) {
    embed
      .setDescription('**Some cool stuff I can do:**')
    client.commands.map(cmd => {
      embed.addField('\u200b', `__**Name:**__ *${ cmd.help.name }*\n__**Description:**__  *${ cmd.help.description }*\n__**Usage:**__  *${ cmd.help.usage }*`)
    })
  } else {
    const cmd = client.commands.get(args[0])
    if (!cmd) {
      message.channel.send(`There is no such command! To list all commands, write: \`${ prefix }help\``)
      return 0
    }
    embed
      .setDescription(`**Info about command __${ cmd.help.name }__ :**`)
      .addField('\u200b', `__**Name:**__ *${ cmd.help.name }*\n__**Description:**__  *${ cmd.help.description }*\n__**Usage:**__  *${ cmd.help.usage }*`)
  }
  embed.addField('\u200b', `__**Current Prefix**__: \`${ prefix }\``)
  message.channel.send(embed)
  return 0
}
exports.help = {
  name: '`help`',
  description: 'Show all commands or specific command help',
  usage: 'help `command (optional)`'
}
