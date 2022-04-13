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
    .addSubcommandGroup(subcommand =>
      subcommand
      .addSubcommand(subcommand =>
        subcommand
          .setName('all-time')
          .setDescription('Shows all-time ranking'))
      .addSubcommand(subcommand =>
        subcommand
          .setName('for-day')
          .setDescription('Shows ranking for your date')
          .addStringOption(option => option.setName('date').setRequired(true).setDescription('Enter a date in DD.MM.YYYY format')))
        .setName('ranking')
        .setDescription('Shows ranking')
      
        )
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

    if (option == 'all-time') {
      await interaction.deferReply();

      behaviorCounter.getRanking(null, interaction.guild.id, interaction, (data, labels) => {
        if (data.length == 0) return interaction.editReply({ content: 'No data!' });

        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Behavior level ranking | All-time', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if (option == 'for-day') {
      await interaction.deferReply();

      const userDate = interaction.options.getString('date');
      const parts = userDate.replace(/\./g, '-').split('-');
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!date.toLocaleString()) return interaction.reply({ content: 'Invalid date!' });

      behaviorCounter.getRanking(date, interaction.guild.id, interaction, (data, labels) => {
        if (data.length == 0) return interaction.editReply({ content: 'No data!' });

        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: [`Behavior level ranking | ${userDate}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if (option == 'today') {
      await interaction.deferReply();

      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let hideId = '';
      let showOneUser = false;
      const member = interaction.options.getMember('user');
      if (member) {
        hideId = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, interaction.guild.id, interaction, users => {
        chartGenerator.sendChart(interaction, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hideId, chartTitle: [`Behavior level over time | ${now.getDate()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${now.getFullYear()}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if (option == 'day') {
      const userDate = interaction.options.getString('date');
      const parts = userDate.replace(/\./g, '-').split('-');
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!date.toLocaleString()) return interaction.reply({ content: 'Invalid date!' });

      await interaction.deferReply();

      let hideId = '';
      let showOneUser = false;
      const member = interaction.options.getMember('user');
      if (member) {
        hideId = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, interaction.guild.id, interaction, users => {
        chartGenerator.sendChart(interaction, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hideId, chartTitle: [`Behavior level over time | ${userDate}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if (option == 'dates-list') {
      const checkMessageLength = require('../vitek_modules/checkMessageLength');
      behaviorCounter.getAvailableDates(interaction.guild.id, interaction, dateList => {
        checkMessageLength.send(`**Available dates:** \`\`\`${dateList.join(', ')}\`\`\``, interaction);
      });
    }
    else if (option == 'help') {
      sendEmbed(interaction, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
      \`/level ranking all-time\` - Ranking
      \`/level ranking for-day <date DD-MM-YYYY format>\` - Ranking for the date
      \`/level today\` - Show levels over time for today
      \`/level day <date DD-MM-YYYY format>\` - Show levels over time for the date
      \`/level dates\` - Show available dates`);
    }
  },
};