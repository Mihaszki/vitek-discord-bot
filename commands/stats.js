module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, serverMessages, items) => {
      let description = '**Most active users**:\n\n``User | Messages``\n';
      let swears = 0;
      let words = 0;
      for(const item of items) {
        description += `<@${item._id.user_id}> | ${item.count}\n`;
        swears += parseInt(item.swears);
        words += parseInt(item.words);
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