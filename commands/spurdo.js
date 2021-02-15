module.exports = {
  name: 'spurdo',
  description: 'Say something in spurdo sparde language',
  usage: '<text>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const { prefix } = require('../bot_config.json');
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    const msg = message.cleanContent.slice(prefix.length + this.name.length + 1);
	
    checkMessageLength.send(spurdoTranslator.translate(msg), message);
  },
};