const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kurwa')
    .setDescription('Add Kurwas to text')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a text')
        .setRequired(true)),
  async execute(interaction) {
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const kurwoSkrypt = require('../vitek_modules/kurwoSkrypt');
    checkMessageLength.send(kurwoSkrypt.run(interaction.options.getString('text')), interaction);
  },
};