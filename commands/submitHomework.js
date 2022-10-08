const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Add a homework entry!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
