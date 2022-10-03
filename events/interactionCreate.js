const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        const logChannel = interaction.client.channels.cache.get('1024363665731895437');
        const timeStamp = Date.now();
        const logEmbed = new EmbedBuilder()
            .setDescription(`${interaction.user} in #${interaction.channel} used the command [${interaction}]!`)
            .setColor(0x800080)
            .setTimestamp(timeStamp);

		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction. (${interaction})`);
        logChannel.send({embeds: [logEmbed]});
	},
};