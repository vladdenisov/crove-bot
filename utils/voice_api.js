const reactions = require('./reactions.js');
const { MessageEmbed } = require('discord.js');
exports.join = async (client, message) => {
    if (message.member.voice.channel) {
        await message.member.voice.channel.join()
        .then(connection => {
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = { 
                    connection: connection, 
                    dispatcher: null, 
                    queue: [] 
                };
                reactions.hook(client, message);
            }
            if (servers[message.guild.id].connection === connection) return;
            else {
                servers[message.guild.id].connection = connection;
                servers[message.guild.id].queue = [];
            }
            
        });
    } else {
        message.reply('You need to join a voice channel first!');
    }
    
};
exports.leave = async (client, message) => {
    await message.member.voice.channel.leave();
    servers[message.guild.id].connection = {};
    servers[message.guild.id].dispatcher.destroy();
    message.channel.messages.fetch().then((messages) => {
        messages = Array.from(messages);
        let first_message = messages[messages.length - 1][1];
        let second_message = messages[messages.length - 2][1];
        const eEmbed = new MessageEmbed()
            .setColor('#0652DD')
            .setTitle('Music Bot')
            .setAuthor('Music')
            .setDescription('Playing Music')
            .setThumbnail('https://cdn.discordapp.com/avatars/573460427753914368/5f6f60497f371261922916793ffbead0.png')
            .addField('Now Playing', 'Nothing')
            .addBlankField()
            .addField('Send link here to play something.', "Waiting...");
        first_message.edit(eEmbed);
        second_message.edit("***Queue List:***");
    });
};