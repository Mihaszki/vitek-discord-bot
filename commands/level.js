module.exports = {
  name: 'level',
  description: 'Behaviour level stats',
  usage: 'help',
  cooldown: 1,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const behaviourCounter = require('../vitek_db/behaviourCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');

    if(args[0] == 'ranking') {
      behaviourCounter.getRanking(message.guild.id, message, (data, labels) => {
        if(data.length == 0) return message.channel.send('There is no data yet!');
        chartGenerator.sendChart(message, data, labels,
          { width: 1500, height: 1000, chartTitle: ['Behaviour level Top 15', '(Higher is better)', ' '], unit: '%' });
      });
    }
    else {
      const embed = new Discord.MessageEmbed()
        .setColor('#fff200')
        .setTitle('Behaviour - help')
        .setThumbnail(message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setDescription(`Level is a command that can show your "behavior level" based on the messages you send.
        \`.level ranking\` - Show ranking
        `);
      message.channel.send(embed);
    }
  },
};