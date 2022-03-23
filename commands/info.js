const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows info about the bot'),
  async execute(interaction) {
    const { MessageEmbed } = require('discord.js');
    const config = require('../bot_config');
    const { guildIcon } = require('../vitek_modules/getMention');

    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const embed = new MessageEmbed()
      .setColor('#00aeff')
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
      })
      .setThumbnail(guildIcon(interaction))
      .addFields(
        { name: 'Author', value: config.bot_author, inline: true },
        { name: 'Current server', value: interaction.guild.name, inline: true },
        { name: 'Total members', value: interaction.guild.memberCount.toString(), inline: true },
        { name: 'Server count', value: interaction.client.guilds.cache.size.toString(), inline: true },
      )
      .setFooter({ text: `Websocket heartbeat: ${interaction.client.ws.ping}ms | Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, iconURL: guildIcon(interaction) });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL(config.github_link)
          .setLabel('Github')
          .setStyle('LINK'),
        new MessageButton()
          .setURL(guildIcon(interaction))
          .setLabel('Server icon')
          .setStyle('LINK'),
      );

    return interaction.editReply({ embeds: [embed], components: [row] });
  },
};