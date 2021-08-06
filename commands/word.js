module.exports = {
  name: 'word',
  description: 'Words usage stats',
  options: [
    {
      name: 'usage',
      description: 'Get words usage',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'words',
          description: 'Enter the words separated by a comma',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'ranking',
      description: 'Shows ranking',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'word',
          description: 'Enter one word',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'help',
      description: 'Shows help',
      type: 'SUB_COMMAND',
    },
  ],
  cooldown: 2,
  async execute(interaction) {
    const wordCounter = require('../vitek_db/wordCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    const arg1 = interaction.options.getSubcommand();

    if(arg1 == 'usage') {
      interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
      const _args = interaction.options.getString('words').toLowerCase();
      let words = _args.split(',');
      words = words.filter(el => { return el !== null && el !== ''; });
      words = words.map(str => str.trim());
      words = Array.from(new Set(words));
      if(!words[0]) return interaction.editReply({ content: 'You must give atleast one word!' });
      wordCounter.getUsage(words, interaction.guild.id, interaction, (labels, data) => {
        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Words usage stats', ' '], unit: '' });
      });
    }
    else if(arg1 == 'ranking') {
      interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
      const sentence = interaction.options.getString('word');
      if(!sentence) return interaction.editReply({ content: 'You must give a word/sentence!' });
      wordCounter.getRanking(sentence.toLowerCase(), interaction.guild.id, interaction, (labels, data) => {
        chartGenerator.sendChart(interaction, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Word usage ranking', sentence.length > 40 ? sentence.slice(0, 40) + '...' : sentence, ' '], unit: '' });
      });
    }
    else {
      sendEmbed(interaction, 'Word - Help', `\`.word usage <Word1, Word2, Word3 [...]>\` - Check usage of the specified words
      \`.word ranking <Word>\` - Show the word use for each user`);
    }
  },
};