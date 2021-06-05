const commonFunctions = require('../../functions/commonFunctions');

const printTime = (date) => {
  return `${commonFunctions.doubleNumberTime(date.getHours())}:${commonFunctions.doubleNumberTime(date.getMinutes())}`;
};

module.exports = {
	name: 'time',
	description: 'Shows time',
  guildOnly: true,
  cooldown: 2,
  aliases: ['time', 'aika', 'kello', 'clock'],
	async execute(message, args) {
    try {
      let currentDate = new Date();
      const denmark = commonFunctions.convertTimezone(currentDate, 'Europe/Copenhagen');
      const usa = commonFunctions.convertTimezone(currentDate, 'America/Indiana/Indianapolis');
      const uk = commonFunctions.convertTimezone(currentDate, 'Europe/London');

      embedBase = {
        color: 0xC27BA0,
        title: `Kellotaulu`,
        fields: [
          {
            name: 'Suomi',
            value: `${printTime(currentDate)}`,
            inline: true,
          },
          {
            name: 'Tanska',
            value: `${printTime(denmark)}`,
            inline: true,
          },
          {
            name: 'Mississippi',
            value: `${printTime(usa)}`,
            inline: true,
          },
          {
            name: 'Iso-Britannia',
            value: `${printTime(uk)}`,
            inline: true,
          },
        ],
      };
      message.channel.send({ embed: embedBase });
    } catch (error) {
      console.log(error);
			message.react('🙈');
    }
},
};
