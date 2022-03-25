const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Behaviour level stats')
    .addSubcommand(subcommand =>
      subcommand
        .setName('today')
        .setDescription('Shows today\'s level'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('day')
        .setDescription('Shows level for your date')
        .addStringOption(option => option.setName('date').setRequired(true).setDescription('Enter a date in DD.MM.YYYY format')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('ranking')
        .setDescription('Shows ranking'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('dates-list')
        .setDescription('Shows available dates'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Shows help')),
  async execute(interaction) {
    const behaviorCounter = require('../vitek_db/behaviorCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    const option = interaction.options.getSubcommand();

    if(option == 'ranking') {
      await interaction.deferReply();
      behaviorCounter.getRanking(interaction.guild.id, interaction, (data, labels) => {
        if(data.length == 0) return interaction.editReply({ content: 'There is no data yet!' });

        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Behavior level Top 15', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(option == 'today') {
      await interaction.deferReply();

      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let hide_id = '';
      let showOneUser = false;
      const member = interaction.options.getMember('user');
      if(member) {
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, interaction.guild.id, interaction, users => {
        chartGenerator.sendChart(interaction, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${now.getDate()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${now.getFullYear()}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(option == 'day') {
      const userDate = interaction.options.getString('date');
      const parts = userDate.replace(/\./g, '-').split('-');
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if(!date.toLocaleString()) return interaction.reply({ content: 'Invalid date!' });

      await interaction.deferReply();

      let hide_id = '';
      let showOneUser = false;
      const member = interaction.options.getMember('user');
      if(member) {
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, interaction.guild.id, interaction, users => {
        chartGenerator.sendChart(interaction, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${userDate}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(option == 'dates-list') {
      const checkMessageLength = require('../vitek_modules/checkMessageLength');
      behaviorCounter.getAvailableDates(interaction.guild.id, interaction, dateList => {
        checkMessageLength.send(`**Available dates:** \`\`\`${dateList.join(', ')}\`\`\``, interaction);
      });
    }
    else if(option == 'help') {
      sendEmbed(interaction, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
      \`/level ranking\` - Ranking
      \`/level today\` - Show levels over time for today
      \`/level day <date DD-MM-YYYY format>\` - Show levels over time for the date
      \`/level dates\` - Show available dates`);
    }
  },
};