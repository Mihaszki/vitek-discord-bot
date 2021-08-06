module.exports = {
  name: 'info',
  cooldown: 1,
  description: 'Information about the bot',
  guildOnly: true,
  async execute(interaction) {
    const Discord = require('discord.js');
    const config = require('../bot_config');
    console.log(interaction.guild.memberCount);
    const embed = new Discord.MessageEmbed()
      .setColor('#00aeff')
      .setDescription(':heart: **Special thanks to: Jojczak#7487** :heart:')
      .setAuthor(interaction.client.user.tag, interaction.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        { name: 'Author', value: config.bot_author },
        { name: 'Current server', value: interaction.guild.name },
        { name: 'Total members', value: interaction.guild.memberCount.toString() },
        { name: 'Server count', value: interaction.client.guilds.cache.size.toString() },
        { name: 'Server icon', value: interaction.guild.iconURL({ size: 1024, dynamic: true }) },
        { name: 'Github', value: config.github_link },
      );

    return interaction.reply({ embeds: [embed] });
  },
};