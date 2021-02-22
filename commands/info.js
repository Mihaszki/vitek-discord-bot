module.exports = {
  name: 'info',
  cooldown: 1,
  description: 'Information about the bot',
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const config = require('../bot_config.json');
    const { differenceInMinutes } = require('date-fns');
    const loadingMessage = await message.channel.send(':wave:');
    const uptime = differenceInMinutes(new Date(), message.client.botRunningUptime);
    const embed = new Discord.MessageEmbed()
      .setColor('#00aeff')
      .setTitle(`${loadingMessage.author.username} | Info`)
      .setDescription(':heart: **Special thanks to: Jojczak#7487** :heart:')
      .setAuthor(loadingMessage.author.username, message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setThumbnail(message.guild.iconURL())
      .addFields(
        { name: 'Tag', value: loadingMessage.author.tag, inline: true },
        { name: 'ID', value: loadingMessage.author.id, inline: true },
        { name: 'Author', value: config.bot_author, inline: true },
        { name: 'Serving on', value: `${message.client.guilds.cache.size} servers`, inline: true },
        { name: 'Current server', value: message.guild.name, inline: true },
        { name: 'Region', value: message.guild.region, inline: true },
        { name: 'Server icon', value: message.guild.iconURL(), inline: true },
        { name: 'Last restart', value: message.client.botRunningUptime.toLocaleString(config.date_locale), inline: true },
        { name: 'Uptime', value: `${uptime} minutes`, inline: true },
        { name: 'Github', value: config.github_link, inline: true },
        { name: 'Ping', value: `${loadingMessage.createdTimestamp - message.createdTimestamp}ms`, inline: true },
        { name: 'API', value: `${Math.round(message.client.ws.ping)}ms`, inline: true },
      );

    loadingMessage.delete({ timeout: 1000 });
    message.channel.send(embed);
  },
};