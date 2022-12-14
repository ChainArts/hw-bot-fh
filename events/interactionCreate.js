const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        const logChannel = interaction.client.channels.cache.get(process.env.LOG_CHANNEL);
        const timeStamp = Date.now();
        const logEmbed = new EmbedBuilder()
            .setDescription(`${interaction.user} in ${interaction.channel} used the command [${interaction}]!`)
            .setColor(0x800080)
            .setTimestamp(timeStamp);

		console.log(`${interaction.user.tag} in #${interaction.channel.name} used the command [${interaction}]!`);
        logChannel.send({embeds: [logEmbed]});
	},
};