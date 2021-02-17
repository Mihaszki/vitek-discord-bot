module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, serverMessages, items) => {
      let description = `Estimated number of messages on all servers: ${allMessages}\nNumber of messages on this server: ${serverMessages}\n\n**Most active users**:\n\n**User** | **Messages**\n`;
      for(const item of items) {
        description += `<@${item._id.user_id}> | ${item.count}\n`;
      }
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(description);
      message.channel.send(embed);
    });
  },
};