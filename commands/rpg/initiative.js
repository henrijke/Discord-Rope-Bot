const databaseFunctions = require('../../functions/databaseFunctions');
const { Initiative } = require('../../classes/initiativeClass');

const HELP = 'help';

const argCommands = [
  {
    name: 'Initiative',
    explanation: 'Sets or updates your initiative',
    example: '!i 20',
    command(arg) {
      return !isNaN(arg);
    },
    async execute(message, arg) {
      const initiative = new Initiative(message.author.id, message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname: message.author.username, parseInt(arg));
      const result = await databaseFunctions.createOrUpdate( initiative );
      message.react( result.result.ok ? '👍': '👎' );
    }
  },
  {
    name: 'Print',
    explanation: 'Prints out all the initiatives in descending order',
    example: '!i print',
    command(arg) {
      return ['print', 'all'].includes(arg);
    },
    async execute(message, arg) {
      let string = `Initiative Order:`;
      const result = await databaseFunctions.findAll();
      result.forEach(res => {
        if (res){
          string += `\n ${res.initiative} ${res.user_name}`;
        }
      });
      message.channel.send(string);
    }
  },
  {
    name: 'Delete',
    explanation: 'Deletes your initiative',
    example: '!i delete',
    command(arg) {
      return ['delete', 'remove'].includes(arg);
    },
    async execute(message, arg) {
      const result = await databaseFunctions.deleteOne(message.author.id);
      message.react( result ? '👍': '👎' );
    }
  },
  {
    name: 'Delete all',
    explanation: 'Clears the initiative table',
    example: '!i clear',
    command(arg) {
      return ['clean', 'clear', 'empty'].includes(arg);
    },
    async execute(message, arg) {
      const result = await databaseFunctions.deleteAll();
      message.react( result ? '👍': '👎' );
    }
  },
  {
    name: 'Help',
    explanation: `Calls me 👁️👄👁️️`,
    example: '!i help',
    command(arg) {
      return arg.includes(HELP);
    },
    execute(message, arg) {
      const embedBase = {
        color: 0xFD81CF,
        title: `HELP`,
        description: `Here's everything I know about initiatives:`,
        fields: [],
        footer: {
          text: '🤖 Here to help',
        },
      };
      argCommands.forEach(res => {
        embedBase.fields.push({
          name: `${res.name}`,
          value: `${res.explanation}
          **Example:** ${res.example}`,
          })
      });
      message.channel.send({ embed: embedBase });
    }
  }
];

module.exports = {
	name: 'initiative',
	description: 'Sets your initiative',
  usage: '<number>',
  guildOnly: true,
  cooldown: 2,
  aliases: ['ini', 'init', 'i'],
	async execute(message, args) {
    try {

      if (args.join('').toLowerCase().includes(HELP)) {
        argCommands.find(element => element.name.toLowerCase() === HELP).execute(message, args);
        return;
      }

      args.forEach( async (arg, i) => {
        const item = arg.toLowerCase();
        const command = argCommands.find(cmd => cmd.command(item));
        if (command) {
          await command.execute(message, item);
        }
      });
    } catch (error) {
      console.log(error);
			message.react('🙈');
    }
},
};
