exports.run = (client, message, args) => {
    servers[message.guild.id].dispatcher.resume();
}