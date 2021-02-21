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
    const getMention = require('../vitek_modules/getMention');
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'ranking') {
      behaviorCounter.getRanking(message.guild.id, message, (data, labels) => {
        if(data.length == 0) return message.channel.send('There is no data yet!');
        chartGenerator.sendChart(message, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Behavior level Top 15', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(args[0] == 'today') {
      const now = new Date();
      const date_start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const date_stop = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      let hide_id = '';
      let showOneUser = false;
      if(args[1]) {
        const member = getMention.member(args[1], message);
        if(!member) return message.channel.send('You must select one user that is on the server!');
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date_start, date_stop, message.guild.id, message, users => {
        chartGenerator.sendChart(message, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${now.getDate()}.${('0' + (now.getMonth() + 1)).slice(-2)}.${now.getFullYear()}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(args[0] == 'day') {
      if(!args[1]) return message.channel.send('You must specify a date in `DD.MM.YYYY` format!');
      const parts = args[1].replace(/\./g, '-').split('-');
      const date_start = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      const date_stop = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]) + 1);
      if(!date_start.toLocaleString() || !date_stop.toLocaleString()) return message.channel.send('Invalid date!');

      let hide_id = '';
      let showOneUser = false;
      if(args[2]) {
        const member = getMention.member(args[2], message);
        if(!member) return message.channel.send('You must select one user that is on the server!');
        hide_id = member.id;
        showOneUser = true;
      }

      behaviorCounter.getDataForDay(date_start, date_stop, message.guild.id, message, users => {
        chartGenerator.sendChart(message, users,
          { width: 2000, height: 1000, type: 'line', fontSize: 38, showOneUser: showOneUser, showOnlyID: hide_id, chartTitle: [`Behavior level over time | ${args[1]}`, '(Higher is better)', ' '], unit: '%' });
      });
    }
    else {
      sendEmbed(message, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
      \`.level ranking\` - Ranking
      \`.level today\` - Show levels over time for today
      \`.level today <@User>\` - Show user's level over time for today
      \`.level day <date DD-MM-YYYY format>\` - Show levels over time for the date
      \`.level day <date DD-MM-YYYY format> <@User>\` - Show user's level over time for the date`);
    }
  },
};