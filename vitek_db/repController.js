module.exports = {
  sliceReason: function(reason, limit = 90) {
    return reason.length > limit ? reason.slice(0, limit) + '...' : reason;
  },

  sendToDB: async function(message, member, username, reason, repValue) {
    const RepModel = require('../vitek_db/models/repModel');
    const { sendRepEmbed } = require('../vitek_modules/embed');
    try {
      const newRep = new RepModel({
        server_id: message.guild.id,
        reason: reason,
        value: repValue,
        receiver: {
          user_id: member.id,
          username: username,
          tag: member.user.tag,
        },
        sender: {
          user_id: message.author.id,
          username: message.author.username,
          tag: message.author.tag,
        },
      });
      await newRep.save();

      const allPoints = await this.getAllUserPoints(member.id, message);

      sendRepEmbed(message, member, this.sliceReason(reason), repValue, allPoints);
    }
    catch (error) {
      this.sendError(error, message);
    }
  },

  newRep: function(message, args, repValue, commandName) {
    const getMention = require('../vitek_modules/getMention');
    const { prefix } = require('../bot_config');

    const member = getMention.member(args[0], message);
    if(!member) return message.channel.send('You must select one user that is on the server!');
    else if(member.id == message.author.id) return message.channel.send('You can\'t rep yourself!');

    const username = getMention.username(member);
    const reason = message.cleanContent.slice(commandName.length + prefix.length + username.length + 3).trim().replace(/\s+/g, ' ');

    this.sendToDB(message, member, username, reason.length == 0 ? 'None' : reason, repValue);
  },

  getUserHistory: async function(user_id, server_id, message, onSuccess, limit = 10) {
    const RepModel = require('../vitek_db/models/repModel');
    try {
      const items = await RepModel
        .find({ server_id: server_id, 'receiver.user_id': user_id })
        .sort({ field: 'asc', _id: -1 })
        .limit(limit);

      const pointsOnServer = await this.getUserPointsOnServer(server_id, user_id, message);
      const allPoints = await this.getAllUserPoints(user_id, message);

      onSuccess(items, allPoints, pointsOnServer);
    }
    catch (error) {
      this.sendError(error, message);
    }
  },

  getRanking: async function(server_id, message, onSuccess) {
    const RepModel = require('../vitek_db/models/repModel');

    try {
      const items = await RepModel.aggregate([
        { $match: { server_id: server_id } },
        { $group: { _id: { 'user_id': '$receiver.user_id' }, value: { $sum: '$value' } } },
        { $sort: { value: -1 } },
        { $limit: 15 },
      ]);
      onSuccess(items);
    }
    catch (error) {
      this.sendError(error, message);
    }
  },

  getUserPointsOnServer: async function(server_id, user_id, message) {
    try {
      const RepModel = require('../vitek_db/models/repModel');
      const pointsOnServer = await RepModel.aggregate([
        { $match: { server_id: server_id, 'receiver.user_id': user_id } },
        { $group: { _id: null, value: { $sum: '$value' } } },
        { $project: { _id: 0, value: 1 } },
      ]);
      return pointsOnServer.length == 0 ? 0 : pointsOnServer[0].value;
    }
    catch (error) {
      this.sendError(error, message);
    }
  },

  getAllUserPoints: async function(user_id, message) {
    try {
      const RepModel = require('../vitek_db/models/repModel');
      const allPoints = await RepModel.aggregate([
        { $match: { 'receiver.user_id': user_id } },
        { $group: { _id: null, value: { $sum: '$value' } } },
        { $project: { _id: 0, value: 1 } },
      ]);
      return allPoints.length == 0 ? 0 : allPoints[0].value;
    }
    catch (error) {
      this.sendError(error, message);
    }
  },

  sendError: function(error, message) {
    console.error(error);
    return message.channel.send('Something went wrong! Try again later.');
  },
};