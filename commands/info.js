module.exports = {
  name: 'info',
  cooldown: 1,
  description: 'Information about the bot',
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const config = require('../bot_config.json');
    const loadingMessage = await message.channel.send(':wave:');
    const currentServer = message.client.guilds.cache.find(id => id == message.guild.id);
    const embed = new Discord.MessageEmbed()
      .setColor('#00aeff')
      .setTitle(`${config.bot_name} | Info`)
      .setDescription('**Special thanks to: Jojczak#7487** :heart:')
      .setThumbnail(message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })).addFields(
        { name: 'Tag', value: loadingMessage.author.tag, inline: true },
        { name: 'ID', value: loadingMessage.author.id, inline: true },
        { name: 'Author', value: config.bot_author, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Serving on', value: `${message.client.guilds.cache.size} servers`, inline: true },
        { name: 'Current server', value: currentServer.name, inline: true },
        { name: 'Region', value: currentServer.region, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Github', value: config.github_link, inline: true },
        { name: 'Ping', value: `${loadingMessage.createdTimestamp - message.createdTimestamp}ms`, inline: true },
        { name: 'API', value: `${Math.round(message.client.ws.ping)}ms`, inline: true },
      );

    loadingMessage.delete({ timeout: 1000 });
    message.channel.send(embed);
  },
};