module.exports = {
  saveMessage: async function(message) {
    const MessageModel = require('../vitek_db/models/messageModel');
    const profanityCheck = require('../vitek_modules/profanityCheck');

    // Get all attachments from message
    const msgAttachments = [];
    if(message.attachments.first()) {
      for(const att of Array.from(message.attachments.values())) {
        msgAttachments.push({ url: att.url, name: att.name });
      }
    }

    // Save message to DB
    try {
      const newMessage = new MessageModel({
        server_id: message.guild.id,
        message_id: message.id,
        content: message.content,
        cleanContent: message.cleanContent,
        attachments: msgAttachments,
        swears: profanityCheck.count(message.cleanContent + message.author.username),
        words: message.cleanContent.split(' ').length,
        author: {
          user_id: message.author.id,
          username: message.author.username,
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
      const countAll = await MessageModel.find().estimatedDocumentCount();
      const countThisServer = await MessageModel.where({ 'server_id': message.guild.id }).countDocuments();
      const ranking = await MessageModel.aggregate([
        { $match: { server_id: message.guild.id } },
        { $group: { _id: { 'user_id': '$author.user_id' }, count: { $sum: 1 }, swears: { $sum: '$swears' }, words: { $sum: '$words' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      onSuccess(countAll, countThisServer, ranking);
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },
};