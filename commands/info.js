module.exports = {
  name: 'info',
  cooldown: 1,
  description: 'Information about the bot',
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const config = require('../bot_config.json');
    const loadingMessage = await message.channel.send(':wave:');

    const embed = new Discord.MessageEmbed()
    .setColor('#00aeff')
    .setTitle(`${config.bot_name} | Info`)
    .setThumbnail(message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .addFields(
      { name: 'Tag', value: loadingMessage.author.tag, inline: true },
      { name: 'ID', value: loadingMessage.author.id, inline: true },
      { name: 'Author', value: config.bot_author, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Github', value: config.github_link, inline: true },
      { name: 'Ping', value: `${loadingMessage.createdTimestamp - message.createdTimestamp}ms`, inline: true },
      { name: 'API', value: `${Math.round(message.client.ws.ping)}ms`, inline: true },
    );

  loadingMessage.delete({ timeout: 1000 });
  return message.channel.send(embed);
	},
};