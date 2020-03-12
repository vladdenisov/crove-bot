exports.run = async (client, message, args) => {
  message.delete();
  if (!servers[message.guild.id]) {
    message.reply('You need to start music first!').then((e) => setTimeout(() => e.delete(), 2000));
    return;
  }
  const server = servers[message.guild.id];
  switch (args[0]) {
    case 'mv': {
      if (!args[1]) {
        message.reply('Provide a number of song to remove').then((m) => setTimeout(() => m.delete(), 2000));
        return;
      }
      if (server.queue[parseInt(args[1], 10)] && server.queue[parseInt(args[2], 10)]) {
        let t = server.queue[parseInt(args[1], 10)];
        server.queue[parseInt(args[1], 10)] = server.queue[parseInt(args[2], 10)];
        server.queue[parseInt(args[2], 10)] = t;
        await client.channels.fetch(server.channel).then((channel) => {
          channel.messages.fetch().then((messages) => {
            const ARR_MESSAGES = Array.from(messages);
            const m = [];
            t = 0;
            server.queue.map((el) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } return 0; });
            ARR_MESSAGES[ARR_MESSAGES.length - 2][1].edit(`***Queue List: \n*** ${m.join('')}`);
          });
          message.channel.send(`Successfully changed \`${t.title}\` to \`${server.queue[parseInt(args[1], 10)].title}\` position`).then((m) => setTimeout(() => m.delete(), 2000));
        });
      }
      break;
    }
    default: {
      const m = [];
      let t = 0;
      server.queue.map((el) => { if (t === 0) { t += 1; } else if (t > 20) { return 0; } else { t += 1; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } return 0; });
      message.reply(`***Queue List: \n*** ${m.join('')}`).then((e) => setTimeout(() => e.delete(), 7000));
    }
  }
};
