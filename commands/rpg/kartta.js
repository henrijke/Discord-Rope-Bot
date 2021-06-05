module.exports = {
	name: 'kartta',
	description: 'Shows D&D map',
  guildOnly: true,
  cooldown: 2,
  aliases: ['kartta', 'annakartta', 'map'],
	async execute(message, args) {
    try {
      message.channel.send('https://cdn.discordapp.com/attachments/569955835577499648/777197297498587146/saari_rdy.jpg');
    } catch (error) {
      console.log(error);
			message.react('🙈');
    }
},
};
