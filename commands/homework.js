const { SlashCommandBuilder } = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('homework')
		.setDescription('Posts upcoming homework deadlines.')
        .addStringOption(option =>
            option.setName('sort')
                .setDescription('Choose Sorting (Deadline/Subject | Reverse Deadline/Reverse Subject')
                .addChoices(
                    {name: 'Deadline', value:'dl'},
                    {name: 'Subject', value:'sj'},
                    {name: 'Reverse Deadline', value:'rdl'},
                    {name: 'Reverse Subject', value:'rsj'},
                ))
        .addStringOption(option =>
            option.setName('subjectfilter')
                .setDescription('Choose subject to filter')
                .addChoices(
                    {name: '3D-Prototyping', value:'3DPrototyping'},
                    {name: 'Computernetzwerke', value:'Computernetzwerke'},
                    {name: 'Datenbanken', value:'Datenbanken'},
                    {name: 'Englisch', value:'English'},
                    {name: 'Konzeptentwicklung', value:'Konzeptentwicklung'},
                    {name: 'Mathe', value:'Mathe'},
                    {name: 'Mediengestaltung', value:'Mediengestaltung'},
                    {name: 'Multimedia', value:'Multimedia'},
                    {name: 'Programmierung', value:'Programmierung'},
                    {name: 'Webdevelopment', value:'Webdevelopment'},
                )),
	async execute(interaction) {
        delete require.cache[require.resolve('../data/homework')];
        const homework = require('../data/homework');
        const seperator = '---------------------------------------------';
        const hasFilter = interaction.options.getString('subjectfilter') != null;
        let isEmpty = true;
        let sortMethod = 'By Date';
        const homeworkEmbed = new EmbedBuilder()
        .setTitle('Active Assignments:')
        .setTimestamp()
        .setColor(0x800080);
        homeworkEmbed.addFields({name: seperator, value: '** **'});
        switch (interaction.options.getString('sort')){
            case 'dl':
                // Sort by Date
                homework.sort(function(a, b){
                    return (a.deadline - b.deadline);
                });
                break;
                // Sort by Subject
            case 'sj':
                sortMethod = 'By Subject';
                homework.sort(function(a, b){
                    return (a.subject[0].localeCompare(b.subject[0]));
                });
                break;
            case 'rdl':
                sortMethod = 'By Reverse Date';
                // Sort by Reverse Date
                homework.sort(function(a, b){
                    return (b.deadline - a.deadline);
                });
                break;
            case 'rsj':
                sortMethod = 'By Reverse Subject';
                // Sort by Reverse Subject
                homework.sort(function(a, b){
                    return (b.subject[0].localeCompare(a.subject[0]));
                });
                break;
            default:
                // Sort by Date
                homework.sort(function(a, b){
                    return (a.deadline - b.deadline);
                });
                break;
        }
        // Generate Fields
        homework.map(function(hwEntry){
            if (hwEntry.deadline >= (Math.floor(Date.now() / 1000)) && (hasFilter ? hwEntry.subject === interaction.options.getString('subjectfilter') : true)){
                isEmpty = false;
                const d = new Date(hwEntry.deadline * 1000);
                const deadlineDate = d.toLocaleDateString('de-AT') + ' | ' + d.toLocaleTimeString('de-AT').replace(/(:\d{2}| [AP]M)$/, '');
                homeworkEmbed.addFields({name: hwEntry.subject, value:
                '__Beschreibung__: ' + hwEntry.description +
                '\n__Links__: ' + hwEntry.links +
                '\n__Abgabe__: ' + hwEntry.handIn +
                '\n\n**__Deadline__: ' + deadlineDate + '**\n' + seperator + '\n'});
            }
        });
        if (isEmpty){
            if (hasFilter){
                homeworkEmbed.addFields({name: 'No homework in ' + interaction.options.getString('subjectfilter') + '!', value: '** **'});
            }
            else {
                homeworkEmbed.addFields({name: 'No homework!', value: '** **'});
            }
        }
        homeworkEmbed.setFooter({text: 'L Bozo  •  Filter: ' + (hasFilter ? interaction.options.getString('subjectfilter') : 'None') + ' | Sorted: ' + sortMethod});
		await interaction.reply({embeds: [homeworkEmbed]});
	},
};