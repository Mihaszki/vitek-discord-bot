module.exports = {
  sendEmbed: function(message, title, description, thumbnail = null) {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed()
      .setColor('#fff200')
      .setTitle(title)
      .setThumbnail(thumbnail == null ? message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) : thumbnail)
      .setDescription(description);
    message.channel.send(embed);
  },

  sendRepEmbed: function(message, member, reason, repValue, allPoints) {
    const Discord = require('discord.js');
    const { avatar } = require('../vitek_modules/getMention');
    const { positiveRepMessages, negativeRepMessages } = require('../bot_config.json');

    let color = '';
    let randomMessage = '';

    if(repValue == 1) {
      color = '#04ff00';
      randomMessage = positiveRepMessages[Math.floor(Math.random() * positiveRepMessages.length)];
    }
    else {
      color = '#ff0000';
      randomMessage = negativeRepMessages[Math.floor(Math.random() * negativeRepMessages.length)];
    }

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(randomMessage, avatar(member))
      .setThumbnail(message.guild.iconURL())
      .addFields(
        { name: 'Your points:', value: allPoints, inline: true },
        { name: 'From:', value: message.author, inline: true },
        { name: 'To:', value: member, inline: true },
        { name: 'Reason:', value: reason, inline: true },
      );
    message.channel.send(embed);
  },
};