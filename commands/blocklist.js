module.exports = {
  name: 'blocklist',
  description: 'Block user from using the bot',
  cooldown: 1,
  guildOnly: true,
  args: true,
  usage: '<text>',
  async execute(message, args) {
    const { bot_author_id } = require('../bot_config');
    if(message.author.id != bot_author_id) return message.channel.send('This command is allowed only for the bot\'s author!');
    const getMention = require('../vitek_modules/getMention');
    const blockListController = require('../vitek_db/blockListController');
    const { sendEmbed } = require('../vitek_modules/embed');
    const member = getMention.member(args[0], message);

    if(!member) return message.channel.send('You must select a user that is on the server!');
    else if(member.id == message.author.id) return message.channel.send('You can\'t block yourself!');
    else if(member.user.bot) return message.channel.send('You can\'t block a bot!');

    await blockListController.toggleBlock(member.id, message.guild.id);
    message.client.blocklist = await blockListController.getBlockedUsers();
    sendEmbed(message, 'Block List', `${member} is ${blockListController.isBlockedLocal(member.id, message.client.blocklist) == true ? 'blocked' : 'unblocked'}!`);
  },
};