const { SlashCommandBuilder } = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('homework')
		.setDescription('Posts upcoming homework deadlines.'),
	async execute(interaction) {
        delete require.cache[require.resolve('../data/homework')];
        const homework = require('../data/homework');
        const seperator = '----------------------------------';
        const homeworkEmbed = new EmbedBuilder()
        .setTitle('Active Assignments:')
        .setTimestamp();
        homeworkEmbed.addFields({name: seperator, value: '\u200b'});
        // Sort by Date
        homework.sort(function(a, b){
            return (a.deadline - b.deadline);
        });
        // Generate Fields
        homework.map(function(hwEntry){
            if (hwEntry.deadline >= (Math.floor(Date.now() / 1000))){
                const d = new Date(hwEntry.deadline * 1000);
                const deadlineDate = d.toLocaleDateString('de-AT') + ' | ' + d.toLocaleTimeString('de-AT').replace(/(:\d{2}| [AP]M)$/, '');
                homeworkEmbed.addFields({name: hwEntry.subject, value:
                '__Beschreibung__: ' + hwEntry.description +
                '\n__Links__: ' + hwEntry.links +
                '\n__Abgabe__: ' + hwEntry.handIn +
                '\n\n**__Deadline__: ' + deadlineDate + '**\n' + seperator + '\n'});
            }
        });
		await interaction.reply({embeds: [homeworkEmbed]});
	},
};