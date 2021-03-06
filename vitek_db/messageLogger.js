module.exports = {
  saveMessage: async function(message) {
    const MessageModel = require('../vitek_db/models/messageModel');
    const profanityCheck = require('../vitek_modules/profanityCheck');
    const getMention = require('../vitek_modules/getMention');

    // Get all attachments from message
    const msgAttachments = [];
    if(message.attachments.first()) {
      for(const att of Array.from(message.attachments.values())) {
        msgAttachments.push({ url: att.url, name: att.name });
      }
    }

    let username = '';
    const member = getMention.member(`<@${message.author.id}>`, message);
    if(!member) username = message.author.username;
    else username = getMention.username(member);

    // Save message to DB
    try {
      const newMessage = new MessageModel({
        server_id: message.guild.id,
        server_name: message.guild.name,
        channel_id: message.channel.id,
        channel_name: message.channel.name,
        message_id: message.id,
        content: message.content,
        cleanContent: message.cleanContent,
        attachments: msgAttachments,
        swears: profanityCheck.count(message.cleanContent + message.author.username),
        words: message.cleanContent.split(' ').length,
        author: {
          user_id: message.author.id,
          username: username,
          tag: message.author.tag,
          isBot: message.author.bot,
        },
      });
      await newMessage.save();
    }
    catch (error) {
      return console.error(error);
    }
  },

  count: async function(message, onSuccess) {
    const MessageModel = require('../vitek_db/models/messageModel');
    try {
      const countThisServer = await MessageModel.where({ 'server_id': message.guild.id }).countDocuments();
      const userRanking = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id } },
        { $group:
          { _id: { 'user_id': '$author.user_id' },
            isBot: { $last: '$author.isBot' },
            count: { $sum: 1 },
            swears: { $sum: '$swears' },
            words: { $sum: '$words' } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]);
      const channelRanking = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id, channel_id: { $exists: true } } },
        { $group:
          { _id:
            { channel_id: '$channel_id' },
          count: { $sum: 1 },
          channel_name: { $last: '$channel_name' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      console.log(channelRanking);
      onSuccess(countThisServer, userRanking, channelRanking);
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },
};