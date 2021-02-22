module.exports = {
  name: 'word',
  description: 'Words usage stats',
  usage: 'help',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const wordCounter = require('../vitek_db/wordCounter');
    const chartGenerator = require('../vitek_modules/chartGenerator');
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0] == 'usage') {
      const _args = message.cleanContent.toLowerCase().split(' ');
      _args.shift();
      _args.shift();
      let words = _args.join(' ').split(',');
      words = words.filter(el => { return el !== null && el !== ''; });
      words = words.map(str => str.trim());
      words = Array.from(new Set(words));
      if(!words[0]) return message.channel.send('You must give atleast one word!');
      wordCounter.getUsage(words, message.guild.id, message, (labels, data) => {
        chartGenerator.sendChart(message, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Words usage stats', ' '], unit: '' });
      });
    }
    else if(args[0] == 'ranking') {
      args.shift();
      const sentence = args.join(' ').trim();
      if(!sentence) return message.channel.send('You must give a word/sentence!');
      wordCounter.getRanking(sentence.toLowerCase(), message.guild.id, message, (labels, data) => {
        chartGenerator.sendChart(message, data,
          { width: 1500, height: 1000, chartLabels: labels, chartTitle: ['Word usage ranking', sentence.length > 40 ? sentence.slice(0, 40) + '...' : sentence, ' '], unit: '' });
      });
    }
    else {
      sendEmbed(message, 'Word - Help', `\`.word usage <Word1, Word2, Word3 [...]>\` - Check usage of the specified words
      \`.word ranking <Word>\` - Show the word use for each user`);
    }
  },
};