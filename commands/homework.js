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
        // Set Filter
        let hasFilter = interaction.options.getString('subjectfilter') != null;
        let filterString = interaction.options.getString('subjectfilter');
        const homeworkChannels = [
            '1022055266071617607',
            '1022055303459643402',
            '1022055369490563072',
            '1022058485619380275',
            '1022058550828224612',
            '1022058620399136799',
            '1022058815190990878',
            '1022058915468427324'];
        if (homeworkChannels.includes(interaction.channel.id) && hasFilter === false){
            switch (interaction.channel.id){
                case homeworkChannels[0]:
                    filterString = 'Programmierung';
                    break;
                case homeworkChannels[1]:
                    filterString = 'Mathe';
                    break;
                case homeworkChannels[2]:
                    filterString = 'Webdevelopment';
                    break;
                case homeworkChannels[3]:
                    filterString = 'Konzeptentwicklung';
                    break;
                case homeworkChannels[4]:
                    filterString = 'English';
                    break;
                case homeworkChannels[5]:
                    filterString = 'Multimedia';
                    break;
                case homeworkChannels[6]:
                    filterString = '3DPrototyping';
                    break;
                case homeworkChannels[7]:
                    filterString = 'Computernetzwerke';
                    break;
                default:
                    filterString = interaction.options.getString('subjectfilter');
                    break;
            }
            hasFilter = true;
        }
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
            if (hwEntry.deadline >= (Math.floor(Date.now() / 1000)) && (hasFilter ? hwEntry.subject === filterString : true)){
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
                homeworkEmbed.addFields({name: 'No homework in ' + filterString + '!', value: '** **'});
            }
            else {
                homeworkEmbed.addFields({name: 'No homework!', value: '** **'});
            }
        }
        homeworkEmbed.setFooter({text: 'L Bozo  •  Filter: ' + (hasFilter ? filterString : 'None') + ' | Sorted: ' + sortMethod});
		await interaction.reply({embeds: [homeworkEmbed]});
	},
};