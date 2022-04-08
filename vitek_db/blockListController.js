module.exports = {
  toggleBlock: async function(userId, serverId) {
    const BlockListModel = require('../vitek_db/models/blocklistModel');
    const isBlocked = await this.isBlocked(userId, serverId);
    try {
      if (!isBlocked) {
        await BlockListModel.updateOne({ user_id: userId }, { $set: { isBlocked: true } });
      }
      else {
        await BlockListModel.updateOne({ user_id: userId }, { $set: { isBlocked: false } });
      }
    }
    catch (error) {
      console.error(error);
    }
  },

  isBlocked: async function(userId, serverId) {
    const BlockListModel = require('../vitek_db/models/blocklistModel');
    try {
      const user = await BlockListModel.findOne({ user_id: userId });
      if (!user) {
        const newBlock = new BlockListModel({
          server_id: serverId,
          user_id: userId,
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

  isBlockedLocal: function(userId, blocklist) {
    const user = blocklist.filter(e => e.user_id == userId);
    if (!user[0]) return false;
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