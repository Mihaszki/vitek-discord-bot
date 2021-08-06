module.exports = {
  sliceReason: function(reason, limit = 90) {
    return reason.length > limit ? reason.slice(0, limit) + '...' : reason;
  },

  sendToDB: async function(interaction, member, username, reason, repValue) {
    const RepModel = require('../vitek_db/models/repModel');
    const { sendRepEmbed } = require('../vitek_modules/embed');
    try {
      const newRep = new RepModel({
        server_id: interaction.guild.id,
        reason: reason,
        value: repValue,
        receiver: {
          user_id: member.id,
          username: username,
          tag: member.user.tag,
        },
        sender: {
          user_id: interaction.user.id,
          username: interaction.user.username,
          tag: interaction.user.tag,
        },
      });
      console.log(newRep);
      await newRep.save();

      const allPoints = await this.getAllUserPoints(member.id, interaction);

      sendRepEmbed(interaction, member, this.sliceReason(reason, 150), repValue, allPoints);
    }
    catch (error) {
      this.sendError(error, interaction);
    }
  },

  newRep: function(interaction, member, reason, repValue) {
    const getMention = require('../vitek_modules/getMention');

    if(member.id == interaction.user.id) return interaction.reply({ content: 'You can\'t rep yourself!' });

    const username = getMention.username(member);
    if(!reason) {
      reason = 'None';
    }
    else {
      reason = reason.trim().replace(/\s+/g, ' ');
    }

    this.sendToDB(interaction, member, username, reason, repValue);
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
        { $group: { _id: { 'user_id': '$receiver.user_id' }, value: { $sum: '$value' }, username: { $last: '$receiver.tag' } } },
        { $sort: { value: -1 } },
        { $limit: 20 },
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