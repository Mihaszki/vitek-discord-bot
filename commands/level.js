module.exports = {
  name: 'level',
  description: 'Behaviour level stats',
  options: [
    {
      name: 'today',
      description: 'Shows today\'s level',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'Select one user',
          type: 'USER',
        },
      ],
    },
    {
      name: 'day',
      description: 'Shows level for your date',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'date',
          description: 'Enter a date in DD.MM.YYYY format',
          type: 'STRING',
          required: true,
        },
        {
          name: 'user',
          description: 'Select one user',
          type: 'USER',
        },
      ],
    },
    {
      name: 'ranking',
      description: 'Shows ranking',
      type: 'SUB_COMMAND',
    },
    {
      name: 'dates',
      description: 'Shows available dates',
      type: 'SUB_COMMAND',
    },
    {
      name: 'help',
      description: 'Shows help',
      type: 'SUB_COMMAND',
    },
  ],
  cooldown: 2,
  async execute(interaction) {
    const behaviorCounter = require('../vitek_db/behaviorCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    const option = interaction.options.getSubcommand();

    if(option == 'ranking') {
      await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
      behaviorCounter.getRanking(interaction.guild.id, interaction, (data, labels) => {
        if(data.length == 0) return interaction.editReply({ content: 'There is no data yet!' });

        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Behavior level Top 15', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(option == 'today') {
      await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

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

      await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

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
    else if(option == 'dates') {
      const checkMessageLength = require('../vitek_modules/checkMessageLength');
      behaviorCounter.getAvailableDates(interaction.guild.id, interaction, dateList => {
        checkMessageLength.send(`**Available dates:** \`\`\`${dateList.join(', ')}\`\`\``, interaction);
      });
    }
    else if(option == 'help') {
      sendEmbed(interaction, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
      \`.level ranking\` - Ranking
      \`.level today\` - Show levels over time for today
      \`.level today <@User>\` - Show user's level over time for today
      \`.level day <date DD-MM-YYYY format>\` - Show levels over time for the date
      \`.level day <date DD-MM-YYYY format> <@User>\` - Show user's level over time for the date
      You can add \`-html\` parameter at the end of the command to output the chart to a html file.
      \`.level dates\` - Show available dates`);
    }
  },
};