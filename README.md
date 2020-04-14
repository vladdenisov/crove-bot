# Crove Bot [![Build Status](https://travis-ci.com/vladdenisov/crove-bot.svg?branch=master)](https://travis-ci.com/vladdenisov/crove-bot) [![Known Vulnerabilities](https://snyk.io/test/github/vladdenisov/crove-bot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vladdenisov/crove-bot?targetFile=package.json) ![GitHub repo size](https://img.shields.io/github/repo-size/vladdenisov/crove-bot) ![GitHub](https://img.shields.io/github/license/vladdenisov/crove-bot)

Crove can play music from __Youtube, Spotify__ and It has many other commands such as `purge, kick, 8ball`, etc.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
- __Node.js 12.0.0 or newer is required.__
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

Edit config.json (use example config and replace values)
```sh
$ nano config.json
```
Start bot
```sh
$ npm run start
```

## Deployment

Install bot on your server and run: 
```sh
$ npm run server
```

## Built With

* [DiscordJS](https://github.com/discordjs/discord.js) - The Discord API framework used
* [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube API framework
* [ytpl](https://github.com/TimeForANinja/node-ytpl) - Used to handle YouTube playlists
* [ytsr](https://github.com/TimeForANinja/node-ytsr) - Used to handle YouTube search

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Vlad Denisov** - *Base work* - [vladdenisov](https://github.com/vladdenisov)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
