const diceFunctions = require('../../functions/diceFunctions');
const commonFunctions = require('../../functions/commonFunctions');
const calculatorFunctions = require('../../functions/calculatorFunctions');
const { DiceResult } = require('../../classes/diceResultClass');

const DICETERM = 'd';
const DIS = 'dis';
const ADV = 'adv';
const MIN = 'min';
const MAX = 'max';
const HELP = 'help';

const diceRegEx = /(\d{1,3}d\d{1,3})+|(d\d{1,3})+/;
const allowedTerms = /^(\d{1,3}d\d{1,3}|d\d{1,3}|[\+\/\(\)\*\-]|[0-9]|dis|adv|(min\d{1,})|(max\d{1,}))+/;
const diceTerms = /(\d{1,3}d\d{1,3}|d\d{1,3}|dis|adv|(min\d{1,})|(max\d{1,}))+/;
const maxDice = /(\d{4,}d|d\d{4,})+/;
const minRegEx = /(\d{1,}min\d{1,})+/;
const maxRegEx = /(\d{1,}max\d{1,})+/;

const argCommands = [
  {
    name: 'Advantage',
    explanation: `${ADV} rolls 2d20 and picks higher`,
    example: 'adv+5',
    command(arg) {
      return arg.includes(ADV);
    },
    execute(message, arg) {
      const diceSum = diceFunctions.rollAdvantage();
      const replacedString = commonFunctions.replaceString(arg, ADV, diceSum.higher);
      return new DiceResult(diceSum.higher, [diceSum.higher, diceSum.lower], replacedString, ADV);
    }
  },
  {
    name: 'Disadvantage',
    explanation: `${DIS} rolls 2d20 and picks lower`,
    example: 'dis+5',
    command(arg) {
      return arg.includes(DIS);
    },
    execute(message, arg) {
      const diceSum = diceFunctions.rollAdvantage();
      const replacedString = commonFunctions.replaceString(arg, DIS, diceSum.lower);
      return new DiceResult(diceSum.lower, [diceSum.lower, diceSum.higher], replacedString, DIS);
    }
  },
  {
    name: 'Dice Rolling',
    explanation: `rolls dice x${DICETERM}y or ${DICETERM}y if only once`,
    example: '3d10 or d20',
    command(arg) {
      return diceRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = diceRegEx.exec(arg)[0];
      const diceNumbers = exec.split(DICETERM);
      diceNumbers[0] = diceNumbers[0] === '' ? 1 : diceNumbers[0];
      const diceResult = diceFunctions.rollXAmount( parseInt(diceNumbers[0]), parseInt(diceNumbers[1]));
      const diceSum = diceResult.reduce((a, b) => a + b, 0);
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum);
      return new DiceResult(diceSum, diceResult, replacedString, exec);
    }
  },
  {
    name: 'Minimum',
    explanation: `Checks the result in front of it and compares it to given minimum value`,
    example: '1d20 min 10 or dis min 5',
    command(arg) {
      return minRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = minRegEx.exec(arg)[0];
      const diceNumbers = exec.split(MIN);
      const diceResult = parseInt(diceNumbers[0]) < parseInt(diceNumbers[1]) ? parseInt(diceNumbers[1]) : parseInt(diceNumbers[0]);
      const diceSum = diceResult;
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum);
      return new DiceResult(diceSum, [diceResult], replacedString, exec);
    }
  },
  {
    name: 'Maximum',
    explanation: `Checks the result in front of it and compares it to given maximum value`,
    example: '1d20 max 10 or dis max 5',
    command(arg) {
      return maxRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = maxRegEx.exec(arg)[0];
      const diceNumbers = exec.split(MAX);
      const diceResult = parseInt(diceNumbers[0]) > parseInt(diceNumbers[1]) ? parseInt(diceNumbers[1]) : parseInt(diceNumbers[0]);
      const diceSum = diceResult;
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum);
      return new DiceResult(diceSum, [diceResult], replacedString, exec);
    }
  },
  {
    name: 'Help',
    explanation: `Calls me 👁️👄👁️️`,
    example: '!r help',
    command(arg) {
      return arg.includes(HELP);
    },
    execute(message, arg) {
      const embedBase = {
        color: 0xFD81CF,
        title: `HELP`,
        description: `Here's everything I know about rolling dice:`,
        fields: [
          {
            name: `Basic Math`,
            value: `sum, subtraction, multiplication, division and brackets
            example: 3 + 4 - 2 * (4 / 2)`,
            }
        ],
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
	name: 'roll',
	description: 'Roll some rpg dice',
  usage: '<number of dice> D <dice sizes> <modifiers> <extra stuff>',
  guildOnly: true,
  aliases: ['r', 'dice', 'heitä'],
	execute(message, args) {
    try {
          // Add the argument list together
          const arguments = args.join('').toLowerCase();

          if (arguments.includes(HELP)) {
            argCommands.find(element => element.name.toLowerCase() === HELP).execute(message, arguments);
            return;
          }
          // Check that the argument list is valid
          if (!allowedTerms.test(arguments) && !maxDice.test(arguments)) {
            message.react('❌');
            return;
          }
          // Array for saving all the roll results
          const endArray = [];
          // Lets make a copy of arguments that we can manipulate
          let stringTest = arguments;
          // Index for possible errors to jump of the loop
          let catchIndex = 0;
          // Loop through the arguments list until everything has been handled
          while (diceTerms.test(stringTest)) {
            // Check if specific command is found
            const command = argCommands.find(cmd => cmd.command(stringTest));
            // if it is lets execute it
            if (command) {
              const result = command.execute(message, stringTest);
              // Push the results to the array
              endArray.push(result);
              // Update the stringTest
              stringTest = result.newString;
            }
            // error handling, maybe clean this up later
            catchIndex++;
            if(catchIndex > 25) throw `error in ${stringTest}`;
          }

          let calculations;
          // Make it a function and execute it
          try {
            calculations = new Function(`return ${stringTest};`)();
          } catch (error){
            throw error;
          }

          // just to make sure everything is as should be
          const calc = calculations && !isNaN(calculations) ? calculations : '🎲Virhe'
          // Create base embed for the return message
          let embedBase = {
      			color: 0x16D346,
      			title: `${calc}`,
      			author: {
      				name: `${message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname: message.author.username}`,
      				icon_url: `${message.author.displayAvatarURL({ format: 'jpg' })}`,
      			},
      			description: `${arguments} = ${calculations}`,
      			fields: [
      			]
      		};
          // Loop through the results array and update embed for each
          endArray.forEach(res => {
            embedBase.fields.push({
      					name: `${res.originalDice} = ${res.amount}`,
      					value: `${res.diceResults.join(' , ')}`,
      					inline: true,
      				});
          });
          // let embedBase = {
      		// 	color: 0xffff00,
      		// 	title: `${calc}`,
      		// 	author: {
      		// 		name: `${message.guild.members.cache.get(message.author.id).nickname}`,
      		// 		icon_url: `${message.author.displayAvatarURL({ format: 'jpg' })}`,
      		// 	},
      		// 	description: `${endArray.map(res => {
          //     return `${res.originalDice} ( ${res.diceResults.join(' + ')} = ${res.amount} ) `;
          //   }).join(' ')}`,
          //   fields: [
      		// 	]
      		// };
          // Loop through the results array and update embed for each
          // endArray.forEach(res => {
          //   embedBase.fields.push({
      		// 			name: `${res.originalDice} = ${res.amount}`,
      		// 			value: `${res.diceResults.join(' , ')}`,
      		// 			inline: true,
      		// 		});
          // });
          // everything should be ok so lets mark the request done and reply
          message.react('🆗');
          message.channel.send({ embed: embedBase });
    } catch (error) {
      // There's an error so lets mark it
      console.log(error);
      message.react('🙈');
    }
},
};
