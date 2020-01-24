const ytdl = require('ytdl-core');

module.exports = async (client, message) => {
    console.log(servers[message.guild.id].queue)
    if (!servers[message.guild.id].queue[1]) {
        try {
            servers[message.guild.id].dispatcher = servers[message.guild.id].connection.play(ytdl(message.content, {
                filter: "audioonly",
                highWaterMark: 1 << 25
            }));
            const eEmbed = new MessageEmbed()
                .setColor(server.queue[0].thumbnail.indexOf("scdn") > 1 ? "#2ecc71" : '#f1c40f')
                .setTitle('Music Bot')
                .setAuthor('Music')
                .setDescription(server.queue[0].thumbnail.indexOf("scdn") > 1 ? "You've added song from spotify! It can sound not as you expect :)" : 'Playing Music')
                .setImage(server.queue[0].thumbnail)
                .addField('Now Playing', `[${server.queue[0].title}](${server.queue[0].thumbnail.indexOf("scdn") > 1 ? server.queue[0].spotifyURL : server.queue[0].url})`)
                .addField('Length: ', server.queue[0].length)
            firstMsg.edit(eEmbed);
            firstMsg.react("⏭").then(() => firstMsg.react('⏯')).then(() => firstMsg.react('⏹'))
            let m = [];
            server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
            secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
        }
        catch (error) {
            console.error([error.message, error.name]);
            message.channel.send(error.message).then((e) => setTimeout(() => e.delete(), 2000))
            server.queue.shift();

        }
    }
    else {

    }
}