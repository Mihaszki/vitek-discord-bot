module.exports = {
  saveToDB: async function(message) {
    const ServerModel = require('../vitek_db/models/serverModel');
    const MessageModel = require('../vitek_db/models/messageModel');

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
        author: {
          user_id: message.author.id,
          username: message.author.username,
          tag: message.author.tag,
          isBot: message.author.bot,
        },
        attachments: msgAttachments,
      });
      await newMessage.save();
    }
    catch (error) {
      return console.error(error);
    }

    // Save server info to DB
    try {
      const findServer = await ServerModel.findOne({ server_id: message.guild.id }).exec();
      if(!findServer) {
        const newServer = new ServerModel({
          name: message.guild.name,
          server_id: message.guild.id,
        });
        await newServer.save();
      }
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
        { $group: { _id: { 'user_id': '$author.user_id', 'username': '$author.username' }, count: { $sum: 1 } } },
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