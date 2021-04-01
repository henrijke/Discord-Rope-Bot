const { OpusEncoder } = require('@discordjs/opus');
const pathToFfmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const sounds = require ('../../assets/jsons/sounds.json');

const fileLocation = '../../assets/voice/';

// const argCommands = [
//   {
//     name: 'Initiative',
//     explanation: 'Sets or updates your initiative',
//     example: '!i 20',
//     command(arg) {
//       return !isNaN(arg);
//     },
//     async execute(message, arg) {
//       const initiative = new Initiative(message.author.id, message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname: message.author.username, parseInt(arg));
//       const result = await databaseFunctions.createOrUpdate( initiative );
//       message.react( result.result.ok ? '👍': '👎' );
//     }
//   },
// ];
module.exports = {
	name: 'soundboard',
	description: 'Lets find some spells',
  cooldown: 10,
  aliases: ['sound', 'voice'],
	description: 'Start soundboard',
	async execute(message, args) {
    try {
			const { voice } = message.member;
			if (!voice.channelID) {
				message.reply('Join a voice channel first!');
				return;
			}

			if (args.length === 0) {
				const array = [];
				sounds.forEach(elem => {
						elem.set.forEach(e => {
							if (!array.find(ar => ar.toLowerCase() === e.toLowerCase())) {
								array.push(e);
							}
						});
				});
				message.channel.send(`State what soundboard you want to use. I have these soundboards right now:\n**${array.join('**,\n**')}**`);
				return;
			}
			const board = sounds.filter(element => element.set.find(elem => elem === args[0].toLowerCase()));
			const connection = await voice.channel.join();

			board.forEach( async (element) => {
				await message.react(element.emoji);
			});

			const filter = (reaction, user) => {
				return board.map(res => res.emoji).includes(reaction.emoji.name) && user.id === message.author.id;
			};
				const collector = message.createReactionCollector(filter, { time: 150000 });

				collector.on('collect', (reaction, user) => {
					const sound = board.find( res => res.emoji === reaction.emoji.name);
					if (sound) {
						connection.play(path.join( __dirname, fileLocation, sound.soundfile ));
					}
				});

				collector.on('end', collected => {
					console.log(`Done`);
				});

    } catch (error) {
      console.log(error);
      message.react('🙈');
    }
	},
};
