module.exports = {
  name: 'math',
  description: 'Solve math using math.js',
  usage: '<equation>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const { evaluate } = require('mathjs');
    const { sendEmbed } = require('../vitek_modules/embed');

    try {
      message.channel.send(`\`\`\`${evaluate(args.join(' '))}\`\`\``);
    }
    catch (error) {
      message.channel.send(`\`\`\`${error}\`\`\``);
    }
  },
};