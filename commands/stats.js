module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, items) => {
      let description = '**Most active users**:\n\n`Place | User | Messages`\n';
      let swears = 0;
      let words = 0;
      let messages = 0;
      for(let i = 0; i < items.length; i++) {
        if(!items[i]._id.isBot) {
          description += `**${i + 1}.** <@${items[i]._id.user_id}> | ${items[i].count}\n`;
          swears += parseInt(items[i].swears);
          words += parseInt(items[i].words);
          messages += parseInt(items[i].count);
        }
      }
      description += `\nNumber of messages: ${messages}\nNumber of messages (counting bots): ${allMessages}\nWords: ${words}\nSwears: ${swears}`;
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(description);
      message.channel.send(embed);
    });
  },
};