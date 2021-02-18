module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (serverMessages, items) => {
      let description = '**Most active users**:\n\n``Place | User | Messages``\n';
      let swears = 0;
      let words = 0;
      for(let i = 0; i < items.length; i++) {
        if(!items[i]._id.isBot) {
          description += `**${i + 1}.** <@${items[i]._id.user_id}> | ${items[i].count}\n`;
          swears += parseInt(items[i].swears);
          words += parseInt(items[i].words);
        }
      }
      description += `\nNumber of messages: ${serverMessages}\nWords: ${words}\nSwears: ${swears}`;
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(description);
      message.channel.send(embed);
    });
  },
};