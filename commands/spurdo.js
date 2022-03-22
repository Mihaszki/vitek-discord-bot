const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spurdo')
    .setDescription('Say something in spurdo sparde language')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a text')
        .setRequired(true)),
  async execute(interaction) {
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    checkMessageLength.send(spurdoTranslator.translate(interaction.options.getString('text')), interaction);
  },
};