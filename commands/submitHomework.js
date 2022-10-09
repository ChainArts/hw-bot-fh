const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Add a homework entry!')
        .addStringOption(option =>
            option.setName('subject')
                .setDescription('Choose subject')
                .setRequired(true)
                .addChoices(
                    {name: '3DPrototyping', value:'3D-Prototyping'},
                    {name: 'Computernetzwerke', value:'Computernetzwerke'},
                    {name: 'Datenbanken', value:'Datenbanken'},
                    {name: 'Englisch', value:'Englisch'},
                    {name: 'Konzeptentwicklung', value:'Konzeptentwicklung'},
                    {name: 'Mathe', value:'Mathe'},
                    {name: 'Mediengestaltung', value:'Mediengestaltung'},
                    {name: 'Multimedia', value:'Multimedia'},
                    {name: 'Programmierung', value:'Programmierung'},
                    {name: 'Webdevelopment', value:'Webdevelopment'},
                ))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Describe the Assignment briefly')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('handin')
                .setDescription('How to hand it in? (online | in person) Where?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('datetime')
                .setDescription('DateTime [yyyy-mm-ddThh:mm:ss] (e.g "2022-10-09T02:44:00)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('links')
                .setDescription('Insert relevant links (Seperate multiple with ","!)')
                .setRequired(true)),
	async execute(interaction) {
        const linkString = interaction.options.getString('links').replace(',', '\n');

        const addition = {
            subject: interaction.options.getString('subject'),
            description: interaction.options.getString('description'),
            handIn: interaction.options.getString('handin'),
            deadline: Math.floor(Date.parse(interaction.options.getString('datetime')) / 1000),
            links: '\n' + linkString,
        };
        fs.readFile('./data/homework.json', 'utf-8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                const obj = JSON.parse(data);
                obj.push(addition);
                const json = JSON.stringify(obj, null, 2);
                fs.writeFile('./data/homework.json', json, 'utf-8', (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Data Written');
                    }
                });
            }
        });
		await interaction.reply('Homework entry has (maybe) been added. Use /homework to check!');
	},
};
