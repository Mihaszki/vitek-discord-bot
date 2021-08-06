module.exports = {
  name: 'kurwa',
  description: 'Add Kurwas to text',
  options: [
    {
      name: 'text',
      description: 'Enter a text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 0.5,
  execute(interaction) {
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const kurwoSkrypt = require('../vitek_modules/kurwoSkrypt');
    checkMessageLength.send(kurwoSkrypt.run(interaction.options.getString('text')), interaction);
  },
};