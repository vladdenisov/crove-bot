exports.join = async (client, message) => {
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
    } else {
        message.reply('You need to join a voice channel first!');
    }
    await message.member.voice.channel.join()
        .then(connection => {
            if (!servers[message.guild.id]) servers[message.guild.id] = { connection: connection, dispatcher: null, queue: [] };
            if (servers[message.guild.id].connection !== {}) return;
            else servers[message.guild.id].connection = connection;
        })
}
exports.leave = async (client, message) => {
    await message.member.voice.channel.leave();
    servers[message.guild.id].connection = {};
    servers[message.guild.id].dispatcher.destroy();
}