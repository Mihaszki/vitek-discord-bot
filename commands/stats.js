const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Number of logged messages'),
  async execute(interaction) {
    const Discord = require('discord.js');
    const messageLogger = require('../vitek_db/messageLogger');
    const getMention = require('../vitek_modules/getMention');
    const { guildIcon } = require('../vitek_modules/getMention');
    const { getHTMLData } = require('../vitek_modules/statstHtmlTemplate');
    await interaction.deferReply();
    messageLogger.count(interaction, (allMessages, messagesNoBots, userRankingAll, channelRankingAll) => {
      const userRanking = userRankingAll.slice(0, 10);
      const channelRanking = channelRankingAll.slice(0, 10);
      let description = '**Most active users:**\n`Place | User | Messages`\n';
      for (let i = 0; i < userRanking.length; i++) {
        const member = getMention.memberInteraction(`<@${userRanking[i]._id.user_id}>`, interaction);
        description += `**${i + 1}.** ${member ? member : userRanking[i].username} | ${userRanking[i].count}\n`;
      }

      description += '\n**Most active channels:**\n`Place | Channel | Messages`\n';
      for (let i = 0; i < channelRanking.length; i++) {
        const channel = interaction.guild.channels.cache.get(channelRanking[i]._id.channel_id);
        description += `**${i + 1}.** ${!channel ? channelRanking[i].channel_name : '<#' + channelRanking[i]._id.channel_id + '>'} | ${channelRanking[i].count}\n`;
      }

      description += `\n\`\`\`Messages: ${messagesNoBots}\nMessages (+bots): ${allMessages.count}\nWords: ${allMessages.words}\nSwears: ${allMessages.swears}\`\`\``;
      const embed = new Discord.MessageEmbed()
        .setColor('#fc9803')
        .setTitle(`Stats - ${interaction.guild.name}`)
        .setThumbnail(guildIcon(interaction))
        .setDescription(description);

        const att = new Discord.MessageAttachment(Buffer.from(getHTMLData(allMessages, messagesNoBots, userRankingAll, channelRankingAll, interaction.guild.name), 'UTF8'), 'stats_full_html.htm');
      interaction.editReply({ embeds: [embed], files: [att] });
    });
  },
};