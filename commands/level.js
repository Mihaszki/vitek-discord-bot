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
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'ranking') {
      behaviorCounter.getRanking(message.guild.id, message, (data, labels) => {
        if(data.length == 0) return message.channel.send('There is no data yet!');
        chartGenerator.sendChart(message, data, labels,
          { width: 1500, height: 1000, chartTitle: ['Behavior level Top 15', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else if(args[0] == 'today') {
      const now = new Date();
      behaviorCounter.getDataForDay(new Date(now.getFullYear(), now.getMonth(), now.getDate()), message.guild.id, message, users => {
        console.log(users);
      });
    }
    else {
      sendEmbed(message, 'Level - Help', `Level is a command that can show your "behavior level" based on the messages you send.
      \`.level ranking\` - Ranking
      \`.level today\` - Show levels over time for today`);
    }
  },
};