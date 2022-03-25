const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('show-remove-data-form')
    .setDescription('Shows a form to delete your messages from the bot\'s database'),
  async execute(interaction) {
    const { removeByUserId } = require('../vitek_db/deleteMessageLogs');
    const { MessageActionRow, MessageSelectMenu } = require('discord.js');

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('deleteformselect')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'No',
              description: 'Cancel',
              value: 'cancel_delete_messages',
              emoji: '❌',
            },
            {
              label: 'Yes',
              description: 'Delete my messages from the database',
              value: 'confirm_delete_messages',
              emoji: '✅',
            },
          ]),
      );

    const filter = inter => inter.isSelectMenu() && inter.customId == 'deleteformselect' && inter.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });
    collector.on('collect', async (collected) => {
      if (collected.values[0] === 'cancel_delete_messages') {
        await interaction.editReply({ content: 'Cancelled!', components: [], ephemeral: true });
      }
      else if (collected.values[0] === 'confirm_delete_messages') {
        await interaction.editReply({ content: 'Done!', components: [], ephemeral: true });
        removeByUserId(interaction.user.id);
      }
    });

    await interaction.reply({ content: 'This operation is gonna delete **all messages** with your user id from the database.\nAre you sure that you want to do this?', components: [row], ephemeral: true });
  },
};