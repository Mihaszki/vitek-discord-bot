module.exports = {
  saveMessage: async function(message) {
    const MessageModel = require('../vitek_db/models/messageModel');
    const profanityCheck = require('../vitek_modules/profanityCheck');
    const getMention = require('../vitek_modules/getMention');

    // Get all attachments from message
    const msgAttachments = [];
    if (message.attachments.first()) {
      for (const att of Array.from(message.attachments.values())) {
        msgAttachments.push({ url: att.url, name: att.name });
      }
    }

    let username = '';
    const member = getMention.member(`<@${message.author.id}>`, message);
    if (!member) username = message.author.username;
    else username = getMention.username(member);

    // Save message to the database
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

  // Get interesting statistics from the database
  count: async function(message, onSuccess) {
    const MessageModel = require('../vitek_db/models/messageModel');
    try {
      const messagesNoBots = await MessageModel.where({ server_id: message.guild.id, 'author.isBot': false }).countDocuments();
      const countThisServer = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id } },
        { $group:
          { _id: null,
            count: { $sum: 1 },
            swears: { $sum: '$swears' },
            words: { $sum: '$words' } } },
      ]);
      const userRanking = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id, 'author.isBot': false } },
        { $group:
          { _id: { 'user_id': '$author.user_id' },
            username: { $last: '$author.tag' },
            count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      const channelRanking = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id, channel_id: { $exists: true } } },
        { $group:
          { _id:
            { channel_id: '$channel_id' },
          count: { $sum: 1 },
          channel_name: { $last: '$channel_name' } } },
        { $sort: { count: -1 } },
      ]);

      onSuccess(countThisServer[0], messagesNoBots, userRanking, channelRanking);
    }
    catch (error) {
      console.error(error);
    }
  },
};