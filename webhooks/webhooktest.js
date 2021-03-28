const Discord = require('discord.js');
const config = require('./config.json');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

const string3 = '333+333+333';

const evil = (fn) => {
	return Function(`"use strict";return (${fn})`)();
}
console.log(evil(string3));

const embed = new Discord.MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');

webhookClient.send('Webhook test', {
	username: 'some-username',
	avatarURL: 'https://i.imgur.com/wSTFkRM.png',
	embeds: [embed],
});
