module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, serverMessages) => {
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Estimated number of messages on all servers: ${allMessages}
        Number of messages on this server: ${serverMessages}
      `);
      message.channel.send(embed);
    });
  },
};