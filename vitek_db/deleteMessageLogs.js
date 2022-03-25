module.exports = {
  removeByUserId: async function(user_id) {
    try {
      const MessageModel = require('./models/messageModel');
      await MessageModel.deleteMany({ 'author.user_id': user_id, 'author.isBot': false });
    }
    catch (error) {
      console.error(error);
    }
  },
};