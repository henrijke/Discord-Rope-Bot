const Discord = require('discord.js');
const Canvas = require('canvas');

const cooldowns = new Discord.Collection();
const { prefix, channels } = require('../config.json');

const imgTypeList = [
	'png',
	'jpg',
	'jpeg'
];

module.exports = {
	name: 'message',
	async execute(message, client) {
		// If the message is in rpg guild and has a image in it
		if (message.attachments.first() && message.channel.id === channels[message.channel.guild.id]?.general.id && !message.author.bot) {
			const keys = message.attachments.map(element => element.attachment);
			if (imgTypeList.find(element => keys[0].slice(-4).toLowerCase().includes(element))) {
				message.react('💾');
				const collector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '💾' && !user.bot, { time: 300000 });
				collector.on('collect', async (reaction, user) => {
					client.channels.cache.get(channels[message.channel.guild.id].img.id).send(new Discord.MessageAttachment(keys[0]));
					message.react('😘');
					collector.stop();
				});
			}
		}
    // Check that starts with prefix and isnt a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // parse the string that user passed
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    // If theres no such command found and skip
    const command = client.commands.get(commandName)
    		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    // Check if the asked command is server only and not dm
    if (command.guildOnly && message.channel.type === 'dm') {
  	return message.reply('I can\'t execute that command inside DMs!');
  }
    //check if the command uses arguments and they are provided
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

    		if (command.usage) {
    			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    		}

    		return message.channel.send(reply);
    }
  // Check if there's cooldown for the command
    if (!cooldowns.has(command.name)) {
  	cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 2) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

  	if (now < expirationTime) {
  		const timeLeft = (expirationTime - now) / 1000;
  		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
  	}

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

    // Otherwise find the command and execute it
    try {
    	command.execute(message, args);
    } catch (error) {
    	console.error(error);
    	message.reply('there was an error trying to execute that command!');
    }
	},
};
