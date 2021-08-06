module.exports = {
  name: 'spurdo',
  description: 'Say something in spurdo sparde language',
  options: [
    {
      name: 'text',
      description: 'Enter a text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 1,
  execute(interaction) {
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    checkMessageLength.send(spurdoTranslator.translate(interaction.options.getString('text')), interaction);
  },
};