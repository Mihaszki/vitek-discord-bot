module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, messagesNoBots, userRanking, channelRanking) => {
      let description = '**Most active users:**\n`Place | User | Messages`\n';
      for(let i = 0; i < userRanking.length; i++) {
        description += `**${i + 1}.** <@${userRanking[i]._id.user_id}> | ${userRanking[i].count}\n`;
      }

      description += '\n**Most active channels:**\n`Place | Channel | Messages`\n';
      for(let i = 0; i < channelRanking.length; i++) {
        const channel = message.guild.channels.cache.get(channelRanking[i]._id.channel_id);
        description += `**${i + 1}.** ${(!channel) ? channelRanking[i].channel_name : '<#' + channelRanking[i]._id.channel_id + '>'} | ${channelRanking[i].count}\n`;
      }

      description += `\n\`\`\`Messages: ${messagesNoBots}\nMessages (+bots): ${allMessages.count}\nWords: ${allMessages.words}\nSwears: ${allMessages.swears}\`\`\``;
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(description);
      message.channel.send(embed);
    });
  },
};