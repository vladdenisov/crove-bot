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
      console.log(cmd.help)
    })
  }
  embed.addField('\u200b', `__**Current Prefix**__: \`${ prefix }\``)
  message.channel.send(embed)
}
exports.help = {
  name: '`help`',
  description: 'Show all commands or specific command help',
  usage: 'help <command (optional)>'
}
