//File to handle Reactions changes
const voice_api = require('./voice_api');
exports.hook = async (client, message) => {
    console.log("Hooked");
    client.on('raw', event => {
        server = servers[message.guild.id];
        let mRCH = message.guild.channels.find(channel => channel.name === "music_req");
        if ((event.t === "MESSAGE_REACTION_ADD" || event.t === "MESSAGE_REACTION_REMOVE") && parseInt(mRCH.id) === parseInt(event.d.channel_id)) {
            if (message.guild.members.get(event.d.user_id).user.bot) return;
            if (event.d.emoji.name === "⏭") {
               server.dispatcher.end();
            }
            if (event.d.emoji.name === "⏹") {
                voice_api.leave(client, message);
            }
            if (event.d.emoji.name === "⏯") {
                if (!server.dispatcher.isPaused) {
                    server.dispatcher.isPaused = true; server.dispatcher.pause(); 
                }
                else {
                    server.dispatcher.isPaused = false; 
                    server.dispatcher.resume();
                }
            }
        }
    });
};