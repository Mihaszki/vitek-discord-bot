module.exports = {
  name: '-rep',
  description: 'Give a negative point to the user',
  usage: '<@User> <reason>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const repController = require('../vitek_db/repController');
    repController.newRep(message, args, -1, this.name);
  },
};