exports.run = async (client, message, args) => {
    message.delete();
    if (!servers[message.guild.id]) {
        message.reply("You need to start music first!").then((e) => setTimeout(() => e.delete(), 2000));
        return;
    }
    let server = servers[message.guild.id];
    switch(args[0]) {
        case "mv":{
            if (!args[1]) {
                message.reply("Provide a number of song to remove").then((m) => setTimeout(() => m.delete(), 2000));
                return;
            }
            if (server.queue[parseInt(args[1])] && server.queue[parseInt(args[2])]) {
                let t = server.queue[parseInt(args[1])];
                server.queue[parseInt(args[1])] = server.queue[parseInt(args[2])];
                server.queue[parseInt(args[2])] = t;
                message.channel.send("Successfully changed `" + t.title + "` to `" + server.queue[parseInt(args[1])].title + "` position").then((m) => setTimeout(() => m.delete(), 2000));
                return;
            }
            break;
        }
        default: {
            let m = [], t =0;
            server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } });
            message.reply(`***Queue List: \n*** ${m.join("")}`).then((e) => setTimeout(() => e.delete(), 7000));
        }
    }
};