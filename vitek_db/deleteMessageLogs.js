module.exports = {
  removeByUserId: async function(userId) {
    try {
      const MessageModel = require('./models/messageModel');
      await MessageModel.deleteMany({ 'author.user_id': userId, 'author.isBot': false });
    }
    catch (error) {
      console.error(error);
    }
  },
};