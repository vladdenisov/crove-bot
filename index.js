//Include all dependencies
const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
//Include config file
const config = require('./config.json');
//Initialize Discord client
const client = new Discord.Client();
//Initialize commands enmap
client.commands = new Enmap();
//Console.log that bot is ready and set bot activity
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(config.game_name);
});
//Load all files with commands
fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});
//Launch command by message
client.on("message", (message) => {
    //Ignore bot messages
    if (message.author.bot) return;
    //Ignore messages without prefix
    if (message.content.indexOf(config.prefix) !== 0) {
        //Except for messages in "music_req" channel. Launch Music command
        if (message.channel.name === "music_req") {
            music_main(message, client, "PLAY_MUSIC");
            return;
        }
        else return;
    };
    //Take args from message
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //Make command lowercased
    const command = args.shift().toLowerCase();
    //See if this command exists 
    const cmd = client.commands.get(command);
    if (!cmd) return;
    //Run command
    cmd.run(client, message, args);
});
//Final bot login
client.login(config.token);
