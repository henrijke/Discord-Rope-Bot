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
const BULLSHIT = 'bullshit';
const CRIT = 'crit'

const diceRegEx = /(\d{1,3}d\d{1,3})+|(d\d{1,3})+/;
const allowedTerms = /^(\d{1,3}d\d{1,3}|d\d{1,3}|[\+\/\(\)\*\-]|[0-9]|dis\d{1,3}|adv\d{1,3}|crit|(min\d{1,})|(max\d{1,}))+$/;
const diceTerms = /(\d{1,3}d\d{1,3}|d\d{1,3}|dis\d{1,3}|adv\d{1,3}|crit|(min\d{1,})|(max\d{1,}))+/;
const maxDice = /(\d{4,}d|d\d{4,}|dis\d{4,}|adv\d{4,})+/;
const minRegEx = /(\d{1,}min\d{1,})+/;
const maxRegEx = /(\d{1,}max\d{1,})+/;
const disRegEx = /(dis\d{1,3})+/;
const advRegEx = /(adv\d{1,3})+/;

let crit = false;

const argCommands = {
  crit: {
    name: 'Critical',
    explanation: `${CRIT} doubles all the dice "2d8 + 2 crit" => "4d8 + 2 crit"`,
    example: '2d8 + 2 crit',
    command(arg) {
      return arg.includes(CRIT);
    },
    execute(message, arg) {
      const replacedString = commonFunctions.replaceString(arg, CRIT, '');
      crit = true;
      return replacedString;
    }
  },
  adv: {
    name: 'Advantage',
    explanation: `${ADV} rolls two times the given amount and picks higher`,
    example: 'adv20 + 5',
    regEx: /(adv\d{1,3})+/,
    command(arg) {
      return advRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = advRegEx.exec(arg)[0];
      const diceNumbers = exec.split(ADV);
      const diceSum = diceFunctions.rollAdvantage(parseInt(diceNumbers[1]));
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum.higher);
      return new DiceResult(diceSum.higher, [diceSum.higher, diceSum.lower], replacedString, exec);
    }
  },
  dis: {
    name: 'Disadvantage',
    explanation: `${DIS} rolls two times the given amount and picks lower`,
    example: 'dis20 +5',
    command(arg) {
      return disRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = disRegEx.exec(arg)[0];
      const diceNumbers = exec.split(DIS);
      const diceSum = diceFunctions.rollAdvantage(parseInt(diceNumbers[1]));
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum.lower);
      return new DiceResult(diceSum.lower, [diceSum.lower, diceSum.higher], replacedString, exec);
    }
  },
  roll: {
    name: 'Dice Rolling',
    explanation: `rolls dice x${DICETERM}y or ${DICETERM}y if only once`,
    example: '3d10 or d20',
    command(arg) {
      return diceRegEx.test(arg);
    },
    execute(message, arg) {
      const exec = diceRegEx.exec(arg)[0];
      const diceNumbers = exec.split(DICETERM);
      // checks the first argument, if its empty example d20 modifies it to 1d20
      diceNumbers[0] = diceNumbers[0] === '' ? 1 : diceNumbers[0];
      // Checks for crit, if so doubles the dice
      diceNumbers[0] = crit ? diceNumbers[0]*2 : diceNumbers[0];
      // Rolls the dice with the given amounts
      const diceResult = diceFunctions.rollXAmount( parseInt(diceNumbers[0]), parseInt(diceNumbers[1]));
      const diceSum = diceResult.reduce((a, b) => a + b, 0);
      const replacedString = commonFunctions.replaceString(arg, exec, diceSum);
      return new DiceResult(diceSum, diceResult, replacedString, exec);
    }
  },
  min: {
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
  max: {
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
  help: {
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
      for (const res in argCommands) {
        if (argCommands.hasOwnProperty(res)) {
          embedBase.fields.push({
            name: `${argCommands[res].name}`,
            value: `${argCommands[res].explanation}
            **Example:** ${argCommands[res].example}`,
          });
        }
      }
      message.channel.send({ embed: embedBase });
    }
  },
  bullshit: {
    name: 'Bullshit',
    explanation: `rolls 200 d100 and counts the average to check for weird stuff`,
    example: '!r bullshit',
    command(arg) {
      return arg.includes(BULLSHIT);
    },
    execute(message, arg) {
      const embedBase = {
        color: 0x7A3E1C,
        title: `Bullshit Detector`,
        description: `So instead of just handling it like an adult you think the bot is broken hmm?`,
        fields: [
          {
            name: `I just rolled 500 d20 and calculated the average`,
            value: `The result is ${(diceFunctions.rollXAmount(500, 20).reduce((a, b) => a + b, 0) / 500).toFixed(2)} so how about just suck it up champ`,
            }
        ],
        footer: {
          text: '💩 Next time roll better',
        },
      };
      message.channel.send({ embed: embedBase });
    }
  }
};

module.exports = {
	name: 'roll',
	description: 'Roll some rpg dice',
  usage: '<number of dice> D <dice sizes> <modifiers> <extra stuff>',
  guildOnly: true,
  aliases: ['r', 'dice', 'heitä'],
	async execute(message, args) {
    try {
          // Add the argument list together
          const arguments = args.join('').toLowerCase();
          // Check for help or bullshit argument and in this case override the message
          // if (arguments.includes(HELP)) {
          //   argCommands.find(element => element.name.toLowerCase() === HELP).execute(message, arguments);
          //   return;
          // } else if (arguments.includes(BULLSHIT)) {
          //   argCommands.find(element => element.name.toLowerCase() === BULLSHIT).execute(message, arguments);
          //   message.react('🧻');
          //   return;
          // }

          if (argCommands[HELP].command(arguments)) {
            argCommands[HELP].execute(message, arguments);
            return;
          } else if (argCommands[BULLSHIT].command(arguments)) {
            argCommands[BULLSHIT].execute(message, arguments);
            message.react('🧻');
            return;
          }

          // Check that the argument list is valid
          if (!allowedTerms.test(arguments) || maxDice.test(arguments)) {
            message.react('❌');
            return;
          }
          // Reset the crit
          crit = false;
          // Array for saving all the roll results
          const endArray = [];
          // Lets make a copy of arguments that we can manipulate
          let stringTest = arguments;
          // if ( stringTest.includes(CRIT) ) {
          //   stringTest = argCommands.find(element => element.name.toLowerCase().includes(CRIT)).execute(message, arguments);
          // }
          if (argCommands[CRIT].command(arguments)) {
            stringTest = argCommands[CRIT].execute(message, arguments);
          }
          // Index for possible errors to jump of the loop
          let catchIndex = 0;
          // Loop through the arguments list until everything has been handled
          while (diceTerms.test(stringTest)) {

            const keys = Object.keys(argCommands);
            const command = keys.find(key => argCommands[key].command(stringTest));
            // Check if specific command is found
            // const command = argCommands.find(cmd => cmd.command(stringTest));
            // if it is lets execute it
            if (command) {
              const result = argCommands[command].execute(message, stringTest);
              // Push the results to the array
              endArray.push(result);
              // Update the stringTest
              stringTest = result.newString;
            }
            // error handling, maybe clean this up later
            catchIndex++;
            if(catchIndex > 10) throw `error in ${stringTest}`;
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
          let stringBuild = arguments;
          endArray.forEach(res => {
            stringBuild = commonFunctions.embedLength(commonFunctions.replaceString(stringBuild, res.originalDice, `${res.originalDice}[${res.diceResults.join(', ')}]`), 950);
          });

          let embedBase = {
      			color: 0x16D346,
      			title: calc,
      			author: {
      				name: `${message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname: message.author.username}`,
      				icon_url: `${message.author.displayAvatarURL({ format: 'jpg' })}`,
      			},
      			description: `\`${stringBuild} = ${calculations}\``,
      			fields: [
      			]
      		};

          if (JSON.stringify(embedBase).length >= 6000) {
            throw 'Embed too long';
          }
          // everything should be ok so lets mark the request done and reply
          message.react('🆗');
          // send the results and add info listener if the user wants more info of the roll
          message.channel.send({ embed: embedBase }).then( async embedMessage => {
            await embedMessage.react('ℹ️');
            const filter = (reaction, user) => {
              return ['ℹ️'].includes(reaction.emoji.name) && !message.author.bot;
            };
            const collector = embedMessage.createReactionCollector(filter, { time: 30000 });

            collector.on('collect', (reaction, user) => {
              const extendedEmbed = {
                color: 0x16D346,
                title: calc,
                author: {
                  name: `${message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname: message.author.username}`,
                  icon_url: `${message.author.displayAvatarURL({ format: 'jpg' })}`,
                },
                description: `\`${stringBuild} = ${calculations}\``,
                fields: [
                ]
              };
              // Loop through the results array and update embed for each
              endArray.forEach(res => {
                const value = `[${res.diceResults.join(', ')}] = **${res.amount}**`;
                extendedEmbed.fields.push({
          					name: commonFunctions.embedLength(res.originalDice, 950),
          					value: commonFunctions.embedLength(value, 950),
          				});
              });
              if (JSON.stringify(extendedEmbed).length >= 6000) {
                collector.stop();
                return;
              }
              embedMessage.edit({embed: extendedEmbed});
              collector.stop();
            });

            collector.on('end', collected => {
            });
          });
    } catch (error) {
      // There's an error so lets mark it
      console.log(error);
      message.react('🙈');
    }
},
};
