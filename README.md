# Crove Bot [![Build Status](https://travis-ci.com/vladdenisov/crove-bot.svg?branch=master)](https://travis-ci.com/vladdenisov/crove-bot) ![Node.js CI](https://github.com/vladdenisov/crove-bot/workflows/Node.js%20CI/badge.svg) [![Known Vulnerabilities](https://snyk.io/test/github/vladdenisov/crove-bot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vladdenisov/crove-bot?targetFile=package.json) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/vladdenisov/crove-bot) ![GitHub repo size](https://img.shields.io/github/repo-size/vladdenisov/crove-bot) ![GitHub](https://img.shields.io/github/license/vladdenisov/crove-bot) 

Crove can play music from __Youtube, Spotify, Soundcloud, Bandcamp__ and It has many other commands such as `purge, kick, 8ball, sauce, gif`, etc.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
- __Node.js 12.0.0 or newer is required.__
- __Java 13 is required.__
- __Follow [instructions](https://github.com/freyacodes/Lavalink#server-configuration) and Install [Lavalink](https://github.com/freyacodes/Lavalink).__
- Linux (change package manager if necessary)   
	```sh 
	$ sudo apt install autoconf libtool g++ make  
	```
- Windows  
	```cmd  
	npm install --global windows-build-tools
	```

### Installing

A step by step series of examples that tell you how to get a development env running

Clone this repo
```sh
$ git clone https://github.com/vladdenisov/crove-bot.git
```
Get into crove-bot folder
```sh 
$ cd crove-bot
```

Install node modules
```sh 
$ npm install 
```

Follow [instructions](https://github.com/Frederikam/Lavalink#server-configuration) and Install [Lavalink](https://github.com/Frederikam/Lavalink). __(If you haven't done this yet)__

Edit application.yml and [index.js](https://github.com/vladdenisov/crove-bot/blob/master/index.js#L27) __(optional)__
```sh
$ nano application.yml
```

Edit config.json (use example config and replace values)
```sh
$ nano config.json
```

Start Lavalink 
```sh 
$ java -jar Lavalink.jar
```

Start bot
```sh
$ npm run start
```

## Deployment

1.  Install bot on your server.

2.  Firstly start Lavalink:
    ```sh 
    $ java -jar Lavalink
    ```

3.  Then start the bot:
    ```sh
    $ npm run server
    ```

## Built With

* [DiscordJS](https://github.com/discordjs/discord.js) - The Discord API framework used
* [Lavalink](https://github.com/freyacodes/Lavalink) - Standalone audio sending node based on Lavaplayer
* [Lavacord](https://github.com/lavacord/lavacord) - Lavalink wrapper for Discord.js

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Vlad Denisov** - *Base work* - [vladdenisov](https://github.com/vladdenisov)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
