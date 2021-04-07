module.exports = {
  name: 'level',
  description: 'Behaviour level stats',
  usage: 'help',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const behaviorCounter = require('../vitek_db/behaviorCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const levelChartHtmlTemplate = require('../vitek_modules/levelChartHtmlTemplate');
    const getMention = require('../vitek_modules/getMention');
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'ranking') {
      behaviorCounter.getRanking(message.guild.id, message, (data, labels) => {
        if(data.length == 0) return message.channel.send('There is no data yet!');

        if(args.includes('-html')) {
          levelChartHtmlTemplate.sendHTML(message, data,
            { fontSize: 20, chartLabels: labels, chartTitle: ['Behavior level Top 15', '(Higher is better)'], unit: '%' });
        }
        else {
          chartGenerator.sendChart(message, data,
            { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Behavior level Top 15', '(Higher is better)', ' '], unit: '%' });
        }
      });
    }
    else if(args[0] == 'today') {
      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let hide_id = '';
      let showOneUser = false;
      if(args[1] && args[1] != '-html') {
        const member = getMention.member(args[1], message);
        if(!member) return message.channel.send('You must select one user that is on the server!');
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, message.guild.id, message, users => {
        if(args.includes('-html')) {
          levelChartHtmlTemplate.sendHTML(message, users,
            { type: 'line', fontSize: 20, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${now.getDate()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${now.getFullYear()}`, '(Higher is better)'], unit: '%' });
        }
        else {
          chartGenerator.sendChart(message, users,
            { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${now.getDate()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${now.getFullYear()}`, '(Higher is better)', ' '], unit: '%' });
        }
      });
    }
    else if(args[0] == 'day') {
      if(!args[1]) return message.channel.send('You must specify a date in `DD.MM.YYYY` format!');
      const parts = args[1].replace(/\./g, '-').split('-');
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if(!date.toLocaleString()) return message.channel.send('Invalid date!');

      let hide_id = '';
      let showOneUser = false;
      if(args[2] && args[2] != '-html') {
        const member = getMention.member(args[2], message);
        if(!member) return message.channel.send('You must select one user that is on the server!');
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date, message.guild.id, message, users => {
        if(args.includes('-html')) {
          levelChartHtmlTemplate.sendHTML(message, users,
            { type: 'line', fontSize: 20, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${args[1]}`, '(Higher is better)'], unit: '%' });
        }
        else {

          chartGenerator.sendChart(message, users,
            { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${args[1]}`, '(Higher is better)', ' '], unit: '%' });
        }
      });
    }
    else if(args[0] == 'dates') {
      const checkMessageLength = require('../vitek_modules/checkMessageLength');
      behaviorCounter.getAvailableDates(message.guild.id, message, dateList => {
        checkMessageLength.send(`**Available dates:** \`\`\`${dateList.join(', ')}\`\`\``, message);
      });
    }
    else {
      sendEmbed(message, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
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