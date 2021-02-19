module.exports = {
  name: 'stats',
  description: 'Number of logged messages',
  cooldown: 3,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    messageLogger.count(message, (allMessages, userRanking, channelRanking) => {
      let description = '**Most active users:**\n\n`Place | User | Messages`\n';
      let swears = 0;
      let words = 0;
      let messages = 0;

      for(let i = 0; i < userRanking.length; i++) {
        if(!userRanking[i].isBot) {
          description += `**${i + 1}.** <@${userRanking[i]._id.user_id}> | ${userRanking[i].count}\n`;
          swears += parseInt(userRanking[i].swears);
          words += parseInt(userRanking[i].words);
          messages += parseInt(userRanking[i].count);
        }
      }

      description += '**The most active channels:**\n\n`Place | Channel | Messages`\n';
      for(let i = 0; i < channelRanking.length; i++) {
        description += `**${i + 1}.** ${channelRanking[i].channel_name} | ${channelRanking[i].count}\n`;
      }

      description += `\n\`\`\`Number of messages: ${messages}\nNumber of messages (with bots): ${allMessages}\nWords: ${words}\nSwears: ${swears}\`\`\``;
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Logged messages - ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(description);
      message.channel.send(embed);
    });
  },
};