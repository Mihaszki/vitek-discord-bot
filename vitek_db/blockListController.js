module.exports = {
  toggleBlock: async function(user_id, server_id) {
    const BlockListModel = require('../vitek_db/models/blocklistModel');
    const isBlocked = await this.isBlocked(user_id, server_id);
    try {
      if(!isBlocked) {
        await BlockListModel.updateOne({ user_id: user_id }, { $set: { isBlocked: true } });
      }
      else {
        await BlockListModel.updateOne({ user_id: user_id }, { $set: { isBlocked: false } });
      }
    }
    catch (error) {
      console.error(error);
    }
  },

  isBlocked: async function(user_id, server_id) {
    const BlockListModel = require('../vitek_db/models/blocklistModel');
    try {
      const user = await BlockListModel.findOne({ user_id: user_id });
      if(!user) {
        const newBlock = new BlockListModel({
          server_id: server_id,
          user_id: user_id,
          isBlocked: false,
        });
        await newBlock.save();
        return false;
      }
      return user.isBlocked;
    }
    catch (error) {
      console.error(error);
      return false;
    }
  },

  isBlockedLocal: function(user_id, blocklist) {
    const user = blocklist.filter(e => e.user_id == user_id);
    if(!user[0]) return false;
    return user[0].isBlocked;
  },

  getBlockedUsers: async function() {
    const BlockListModel = require('../vitek_db/models/blocklistModel');
    try {
      const list = await BlockListModel.find();
      return list;
    }
    catch (error) {
      console.error(error);
      return false;
    }
  },
};