module.exports = {
  name: 'kurwa',
  description: 'Add Kurwas to text',
  cooldown: 0.5,
  guildOnly: true,
  args: true,
  usage: '<tekst>',
  execute(message) {
    const { prefix } = require('../bot_config.json');
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const kurwoSkrypt = require('../vitek_modules/kurwoSkrypt');
    checkMessageLength.send(kurwoSkrypt.run(message.cleanContent.slice(prefix.length + this.name.length + 1)), message);
  },
};