module.exports = {
  name: 'info',
  cooldown: 1,
  description: 'Information about the bot',
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const config = require('../bot_config');
    const { differenceInMinutes } = require('date-fns');
    const loadingMessage = await message.channel.send(':wave:');
    const uptime = differenceInMinutes(new Date(), message.client.botRunningUptime);
    const embed = new Discord.MessageEmbed()
      .setColor('#00aeff')
      .setTitle(`${loadingMessage.author.username} | Info`)
      .setDescription(':heart: **Special thanks to: Jojczak#7487** :heart:')
      .setAuthor(loadingMessage.author.username, message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setThumbnail(message.guild.iconURL())
      .setImage(message.guild.iconURL({ size: 1024 }))
      .addFields(
        { name: 'Bot ID', value: loadingMessage.author.id, inline: false },
        { name: 'Author', value: config.bot_author, inline: false },
        { name: 'Serving on', value: `${message.client.guilds.cache.size} servers`, inline: false },
        { name: 'Current server', value: message.guild.name, inline: false },
        { name: 'Region', value: message.guild.region, inline: false },
        { name: 'Server icon', value: message.guild.iconURL({ size: 1024, dynamic: true }), inline: false },
        { name: 'Last restart', value: message.client.botRunningUptime.toLocaleString(config.date_locale), inline: false },
        { name: 'Uptime', value: `${uptime} minutes`, inline: false },
        { name: 'Github', value: config.github_link, inline: false },
        { name: 'Ping', value: `${loadingMessage.createdTimestamp - message.createdTimestamp}ms`, inline: false },
        { name: 'API', value: `${Math.round(message.client.ws.ping)}ms`, inline: false },
      );

    loadingMessage.delete({ timeout: 1000 });
    message.channel.send(embed);
  },
};