const fetch = require('node-fetch');
const fetchFunctions = require('../../functions/fetchFunctions');
const commonFunctions = require('../../functions/commonFunctions');
const dndAddress = 'https://www.dnd5eapi.co/api/';

// https://cdn.discordapp.com/attachments/583681122664448052/822209702204669952/kuva.jpg
// Sad function to build the embed, refactor later
const fillSpellEmbed = (json) => {
	let embedBase = {};
	// Check if it's a spell or skill
	if (!json.casting_time) {
		embedBase = {
			color: 0x0099ff,
			title: `${json.name}`,
			description: `${json.level}-level ${json.class.name}`,
			fields: [
				{
					name: 'Description',
					value: `${json.desc.join(' ')}`,
				},
			],
			footer: {
				text: '🧙‍♀️henri on velho',
			},
		};
		if (json.prerequisites.length > 0) {
			embedBase.fields.push({
				name: 'Prerequisites',
				value: `${json.prerequisites.join(' ')}`
			});
		}
	} else {
		embedBase = {
			color: 0xffff00,
			title: `${json.name}`,
			description: `${json.level}-level ${json.school.name}`,
			fields: [
				{
					name: 'Casting Time',
					value: `${json.casting_time}`,
					inline: true,
				},
				{
					name: 'Range',
					value: `${json.range}`,
					inline: true,
				},
				{
					name: 'Components',
					value: `${json.components.join(', ')}`,
					inline: true,
				},
				{
					name: 'Duration',
					value: `${json.duration}`,
					inline: true,
				},
			],
			footer: {
				text: '🧙‍♀️henri on velho',
			},
		};
		if (json.material) {
			embedBase.fields.push({
				name: 'Material',
				value: `${json.material}`,
				inline: true,
			});
		}
		if (json.concentration) {
			embedBase.fields.push({
				name: 'Concentration',
				value: `Yes`,
				inline: true,
			});
		}
		if (json.ritual) {
			embedBase.fields.push({
				name: 'Ritual',
				value: `Yes`,
				inline: true,
			});
		}
		if (json.damage) {
			const damageField = {
				name: 'Damage',
				value: ``,
				inline: true,
			}
			if (json.damage.damage_at_slot_level) {
				const keys = Object.keys(json.damage.damage_at_slot_level);
				damageField.value = `${json.damage.damage_type ? json.damage.damage_type.name + 'Damage \n' : ''} ${keys.map(res => `lvl ${res}: ${json.damage.damage_at_slot_level[res]}`).join('\n')}`;
			} else if (json.damage.damage_at_character_level) {
				const keys = Object.keys(json.damage.damage_at_character_level);
				damageField.value = `${json.damage.damage_type ? json.damage.damage_type.name + 'Damage \n' : ''} ${keys.map(res => `lvl ${res}: ${json.damage.damage_at_character_level[res]}`).join('\n')}`;
			}
			embedBase.fields.push(damageField);
		}
		if (json.area_of_effect) {
			embedBase.fields.push({
				name: 'Area of Effect',
				value: `${json.area_of_effect.size} ft. ${json.area_of_effect.type}`,
				inline: true,
			});
		}
		if (json.desc) {
			const desc = json.desc.join(' ');
				embedBase.fields.push({
				name: 'Description',
				value: `${ commonFunctions.embedLength(desc, null) }`,
			});
		}
		if (json.higher_level) {
			embedBase.fields.push({
				name: 'At Higher Level',
				value: `${json.higher_level.join(' ')}`,
			});
		}
	}
	return embedBase;
}


module.exports = {
	name: 'spell',
	description: 'Lets find some spells',
  usage: '<spells name>',
	guildOnly: true,
  cooldown: 2,
  aliases: ['s', 'loitsu', 'skill'],
	async execute(message, args) {
    try {
					let embedBase;
					// add all the arguments together to single search string
					const arguments = args.join('-').toLowerCase();
					// make an api call
					let response = await fetchFunctions.fetchAPI(`${dndAddress}spells/${arguments}`);
					let json = await response.json();
					if (!json.error) {
						// if something is found it means its spell so lets add it
						embedBase = fillSpellEmbed(json);
					} else {
						// otherwise lets try our luck if its a feature
						response = await fetch(`${dndAddress}features/${arguments}`);
						json = await response.json();
						if (!json.error) {
							// if we are lucky lets fill the embed
							embedBase = fillSpellEmbed(json);
						}
					}
					// if there's no luck then inforn, otherwise send embed
					message.channel.send(json.error ? `:person_shrugging: Sori mut ei löytyny` : { embed: embedBase });
    } catch (error) {
      console.log(error);
			message.react('🙈');
    }
},
};
