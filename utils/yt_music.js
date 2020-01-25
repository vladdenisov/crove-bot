const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const voice_api = require('./voice_api');
//Add song to server queue
exports.queue = async (client, message) => {
    let video_info = await ytdl.getBasicInfo(message.content);
    let s = video_info.length_seconds;
    servers[message.guild.id].queue.push({
        url: message.content,
        length: (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s, //This expression converts seconds to "h:m:s" format 
        title: video_info.title,
        thumbnail: video_info.player_response.videoDetails.thumbnail.thumbnails[video_info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url
    });
    //If added song is first: then start playing
    if (!servers[message.guild.id].queue[1]) { exports.play(client, message); return; }
    //Else: edit queue message
    await message.channel.messages.fetch().then((messages) => {
        messages = Array.from(messages);
        let secMsg = messages[messages.length - 2][1];
        let m = [], t = 0;
        servers[message.guild.id].queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } });
        secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
    });
};

//Play first song in queue
exports.play = async (client, message) => {
    let server = servers[message.guild.id];
    try {
        server.dispatcher = server.connection.play(ytdl(server.queue[0].url, {
            filter: "audioonly",
            highWaterMark: 1 << 25 //To prevent unexpected end of video
        }));
        server.dispatcher.on('end', async () => {
            server.queue.shift();
            if (!server.queue[0]) { await voice_api.leave(client, message); return; }
            this.play(client, message);
            return;

        });
        server.dispatcher.on('error', (error) => {
            console.log(error);
            server.queue.shift();
            this.play(client, message);
        });
        //Edit main message and queue message
        message.channel.messages.fetch().then((messages) => {
            messages = Array.from(messages);
            let first_message = messages[messages.length - 1][1];
            let second_message = messages[messages.length - 2][1];
            let t = 0, m = [];
            const eEmbed = new MessageEmbed()
                .setColor(server.queue[0].thumbnail.indexOf("scdn") > 1 ? "#2ecc71" : '#f1c40f')
                .setTitle('Music Bot')
                .setAuthor('Music')
                .setDescription(server.queue[0].thumbnail.indexOf("scdn") > 1 ? "You've added song from spotify! It can sound not as you expect :)" : 'Playing Music')
                .setImage(server.queue[0].thumbnail)
                .addField('Now Playing', `[${server.queue[0].title}](${server.queue[0].thumbnail.indexOf("scdn") > 1 ? server.queue[0].spotifyURL : server.queue[0].url})`)
                .addField('Length: ', server.queue[0].length);
            first_message.edit(eEmbed);
            //first_message.react("⏭").then(() => first_message.react('⏯')).then(() => first_message.react('⏹'));
            server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } });
            second_message.edit(`***Queue List: \n*** ${m.join("")}`);
        });
    }
    catch (error) {
        //Handle errors
        console.error([error.message, error.name]);
        message.channel.send(error.message).then((e) => setTimeout(() => e.delete(), 2000));
        servers[message.guild.id].queue.shift();
    }
};