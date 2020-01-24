exports.run = (client, message, args) => {
    servers[message.guild.id].dispatcher.pause();
    console.log(servers[message.guild.id].dispatcher.count);
};