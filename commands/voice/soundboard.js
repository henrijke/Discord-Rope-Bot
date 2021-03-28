// const { OpusEncoder } = require('@discordjs/opus');
// const pathToFfmpeg = require('ffmpeg-static');
//
// // Create the encoder.
// // Specify 48kHz sampling rate and 2 channel size.
// const encoder = new OpusEncoder(48000, 2);
//
// // Encode and decode.
// const encoded = encoder.encode(buffer);
// const decoded = encoder.decode(encoded);
const boing = '../../assets/voice/boing.mp3';
const swish = '../../assets/voice/swish.mp3';

module.exports = {
	name: 'soundboard',
	description: 'Lets find some spells',
  cooldown: 10,
  aliases: ['sound', 'voice'],
	description: 'Start soundboard',
	async execute(message, args) {
    try {
      // console.log(message);

      if (message.member.voice.channel) {
  		const connection = await message.member.voice.channel.join();
  	}

      message.react('👍').then(() => message.react('👎'));

      const filter = (reaction, user) => {
      	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      // async function play(voiceChannel) {
      // 	const connection = await voiceChannel.join();
      // 	connection.play('audio.mp3');
      // }

      message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      	.then(collected => {
      		const reaction = collected.first();
          // Create a dispatcher

      		if (reaction.emoji.name === '👍') {
      			const dispatcher = connection.play('/assets/voice/boing.mp3');
      		} else {
      			const dispatcher = connection.play('/assets/voice/boing.mp3');
      		}

          dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
          });

          dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
          });

          // Always remember to handle errors appropriately!
          dispatcher.on('error', console.error);
          dispatcher.destroy();
      	})
      	.catch(collected => {
      		message.reply('hmm');
      	});
    } catch (error) {
      console.log(error);
      message.react('🙈');
    }
	},
};
