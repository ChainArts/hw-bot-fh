const { SlashCommandBuilder } = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tests')
		.setDescription('Posts upcoming test deadlines.')
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
        delete require.cache[require.resolve('../data/tests')];
        const tests = require('../data/tests');
        const seperator = '---------------------------------------------';
        // Set Filter
        let hasFilter = interaction.options.getString('subjectfilter') != null;
        let filterString = interaction.options.getString('subjectfilter');
        const testChannels = [
            '1022055266071617607',
            '1022055303459643402',
            '1022055369490563072',
            '1022058485619380275',
            '1022058550828224612',
            '1022058620399136799',
            '1022058815190990878',
            '1022058915468427324'];
        if (testChannels.includes(interaction.channel.id) && hasFilter === false){
            switch (interaction.channel.id){
                case testChannels[0]:
                    filterString = 'Programmierung';
                    break;
                case testChannels[1]:
                    filterString = 'Mathe';
                    break;
                case testChannels[2]:
                    filterString = 'Webdevelopment';
                    break;
                case testChannels[3]:
                    filterString = 'Konzeptentwicklung';
                    break;
                case testChannels[4]:
                    filterString = 'English';
                    break;
                case testChannels[5]:
                    filterString = 'Multimedia';
                    break;
                case testChannels[6]:
                    filterString = '3DPrototyping';
                    break;
                case testChannels[7]:
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
        const testEmbed = new EmbedBuilder()
        .setTitle('Upcoming Tests:')
        .setTimestamp()
        .setColor(0x800080);
        testEmbed.addFields({name: seperator, value: '** **'});
        switch (interaction.options.getString('sort')){
            case 'dl':
                // Sort by Date
                tests.sort(function(a, b){
                    return (a.deadline - b.deadline);
                });
                break;
                // Sort by Subject
            case 'sj':
                sortMethod = 'By Subject';
                tests.sort(function(a, b){
                    return (a.subject[0].localeCompare(b.subject[0]));
                });
                break;
            case 'rdl':
                sortMethod = 'By Reverse Date';
                // Sort by Reverse Date
                tests.sort(function(a, b){
                    return (b.deadline - a.deadline);
                });
                break;
            case 'rsj':
                sortMethod = 'By Reverse Subject';
                // Sort by Reverse Subject
                tests.sort(function(a, b){
                    return (b.subject[0].localeCompare(a.subject[0]));
                });
                break;
            default:
                // Sort by Date
                tests.sort(function(a, b){
                    return (a.deadline - b.deadline);
                });
                break;
        }
        // Generate Fields
        tests.map(function(hwEntry){
            if (hwEntry.deadline >= (Math.floor(Date.now() / 1000)) && (hasFilter ? hwEntry.subject === filterString : true)){
                isEmpty = false;
                const d = new Date(hwEntry.deadline * 1000);
                const deadlineDate = d.toLocaleDateString('de-AT') + ' | ' + d.toLocaleTimeString('de-AT').replace(/(:\d{2}| [AP]M)$/, '');
                testEmbed.addFields({name: hwEntry.subject, value:
                '__Beschreibung__: ' + hwEntry.description +
                '\n__Links__: ' + hwEntry.links +
                '\n\n**__Termin__: ' + deadlineDate + '**\n' + seperator + '\n'});
            }
        });
        if (isEmpty){
            if (hasFilter){
                testEmbed.addFields({name: 'No tests in ' + filterString + '!', value: '** **'});
            }
            else {
                testEmbed.addFields({name: 'No tests!', value: '** **'});
            }
        }
        testEmbed.setFooter({text: 'L Bozo  •  Filter: ' + (hasFilter ? filterString : 'None') + ' | Sorted: ' + sortMethod});
		await interaction.reply({embeds: [testEmbed]});
	},
};