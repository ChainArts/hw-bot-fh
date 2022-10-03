const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('homework')
		.setDescription('Posts upcoming homework deadlines.'),
	async execute(interaction) {
		await interaction.reply('I will post homework deadlines here soon™');
	},
};