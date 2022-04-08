const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('word')
    .setDescription('Words usage stats')
    .addSubcommand(subcommand =>
      subcommand
        .setName('usage')
        .setDescription('Get words\' usage')
        .addStringOption(option => option.setName('words').setRequired(true).setDescription('Enter the words separated by a comma')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('ranking')
        .setDescription('Shows ranking')
        .addStringOption(option => option.setName('word').setRequired(true).setDescription('Enter one word')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Shows help')),
  async execute(interaction) {
    const wordCounter = require('../vitek_db/wordCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    const arg1 = interaction.options.getSubcommand();

    if (arg1 == 'usage') {
      await interaction.deferReply();
      const _args = interaction.options.getString('words').toLowerCase();
      let words = _args.split(',');
      words = words.filter(el => { return el !== null && el !== ''; });
      words = words.map(str => str.trim());
      words = Array.from(new Set(words));
      if (!words[0]) return interaction.editReply({ content: 'You must give atleast one word!' });
      wordCounter.getUsage(words, interaction.guild.id, interaction, (labels, data) => {
        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Words usage stats', ' '], unit: '' });
      });
    }
    else if (arg1 == 'ranking') {
      await interaction.deferReply();
      const sentence = interaction.options.getString('word');
      if (!sentence) return interaction.editReply({ content: 'You must give a word/sentence!' });
      wordCounter.getRanking(sentence.toLowerCase(), interaction.guild.id, interaction, (labels, data) => {
        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Word usage ranking', sentence.length > 40 ? sentence.slice(0, 40) + '...' : sentence, ' '], unit: '' });
      });
    }
    else {
      sendEmbed(interaction, 'Word - Help', `\`/word usage <Word1, Word2, Word3 [...]>\` - Check usage of the specified words
      \`/word ranking <Word>\` - Show the word use for each user`);
    }
  },
};