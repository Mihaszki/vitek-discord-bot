const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Random number generator')
    .addIntegerOption(option =>
      option.setName('min')
        .setDescription('Enter a min number'))
    .addIntegerOption(option =>
      option.setName('max')
        .setDescription('Enter a max number')),
  async execute(interaction) {
    let min = interaction.options.getInteger('min');
    let max = interaction.options.getInteger('max');

    if (!min && !max) {
      min = 0;
      max = 10;
    }
    else if (min === null) {
      min = max * 2;
    }
    else if (max === null) {
      max = min * 2;
    }

    if (min > max) max = [min, min = max][0];

    interaction.reply({ content: (Math.floor(Math.random() * (max - min + 1) + min)).toString() });
  },
};