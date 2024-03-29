module.exports = {
  sendEmbed: function(interaction, title, description, thumbnail = null, attachment = null) {
    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .setColor('#fff200')
      .setTitle(title)
      .setThumbnail(thumbnail == null ? interaction.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) : thumbnail)
      .setDescription(description);
    if(attachment !== null) {
      return interaction.reply({ files: [attachment], embeds: [embed] });
    }
    interaction.reply({ embeds: [embed] });
  },

  sendRepEmbed: function(interaction, member, reason, repValue, allPoints) {
    const { MessageEmbed } = require('discord.js');
    const { avatar, guildIcon } = require('../vitek_modules/getMention');
    const { positiveRepMessages, negativeRepMessages } = require('../bot_config');

    let color = '';
    let randomMessage = 'Thanks!';

    if (repValue == 1) {
      color = '#04ff00';
      randomMessage = positiveRepMessages[Math.floor(Math.random() * positiveRepMessages.length)];
    }
    else {
      color = '#ff0000';
      randomMessage = negativeRepMessages[Math.floor(Math.random() * negativeRepMessages.length)];
    }
    const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor({
        name: randomMessage, iconURL: avatar(member.user),
      })
      .setThumbnail(guildIcon(interaction))
      .addFields(
        { name: 'Your points:', value: allPoints.toString(), inline: true },
        { name: 'From:', value: interaction.user.toString(), inline: true },
        { name: 'To:', value: member.toString(), inline: true },
        { name: 'Reason:', value: reason, inline: true },
      );
    interaction.reply({ embeds: [embed] });
  },
};