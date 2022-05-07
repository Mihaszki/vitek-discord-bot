module.exports = {
  getRanking: async function(date, serverId, message, onSuccess) {
    try {
      const { endOfDay, startOfDay } = require('date-fns');
      const { dateTimezone } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const getMention = require('../vitek_modules/getMention');

      const options = { server_id: serverId, 'author.isBot': false };
      if(date) {
        options.createdAt = { $gte: startOfDay(date), $lte: endOfDay(date) };
      }

      const data = await MessageModel.aggregate([
        { $match: options },
        { $group: {
          _id: { 'user_id': '$author.user_id' },
          count: { $sum: 1 },
          swears: { $sum: '$swears' },
          words: { $sum: '$words' },
          username: { $last: '$author.username' },
        } },
      ]);

      let calculatedData = [];

      for (const user of data) {
        const member = getMention.member(`<@${user._id.user_id}>`, message);
        calculatedData.push({
          username: !member ? user.username : getMention.username(member),
          value: this.calculate(user.count, user.swears, user.words),
        });
      }

      if (data.length == 0) return onSuccess([], []);
      calculatedData = calculatedData.sort((a, b) => (a.value < b.value) ? 1 : -1).slice(0, 20);
      onSuccess(calculatedData.map(a => a.value), calculatedData.map(a => a.username));
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },

  getAvailableDates: async function(serverId, interaction, onSuccess) {
    try {
      const { dateTimezone, dateLocale } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: { server_id: serverId } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: dateTimezone } },
        } },
        { $sort: { '_id': -1 } },
      ]);
      const dates = [];
      if (!data || data.length == 0) return onSuccess([ 'No data.' ]);
      data.forEach(item => {
        dates.push(new Date(item._id).toLocaleDateString(dateLocale).replace(/\//g, '.'));
      });
      onSuccess(dates);
    }
    catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Something went wrong! Try again later.' });
    }
  },

  getDataForDay: async function(date, serverId, interaction, onSuccess) {
    try {
      const { endOfDay, startOfDay } = require('date-fns');
      const { dateTimezone } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const getMention = require('../vitek_modules/getMention');
      const data = await MessageModel.aggregate([
        { $match: { server_id: serverId, 'author.isBot': false, createdAt: { $gte: startOfDay(date), $lte: endOfDay(date) } } },
        { $group: {
          _id: {
            user_id: '$author.user_id',
            hour: { $hour: { date: '$createdAt', timezone: dateTimezone } },
          },
          count: { $sum: 1 },
          swears: { $sum: '$swears' },
          words: { $sum: '$words' },
          username: { $last: '$author.username' },
          user_id: { $last: '$author.user_id' },
          date: { $first: '$createdAt' },
        } },
        { $group: {
          _id: {
            user_id: '$_id.user_id',
          },
          hours: {
            $push: {
              hour: '$_id.hour',
              count: '$count',
              swears: '$swears',
              words: '$words',
              username: '$username',
              date: '$date',
            },
          },
        } },
      ]);

      if (!data || data.length == 0) return interaction.editReply({ content: 'There is no data for your date!' });

      const users = [];
      for (const d of data) {
        const hours = [];
        const sorted = d.hours.sort((a, b) => (a.hour > b.hour) ? 1 : -1);
        sorted.forEach(hour => {
          hours.push({
            hour: hour.hour,
            date: hour.date,
            value: this.calculate(hour.count, hour.swears, hour.words),
          });
        });
        const member = getMention.memberInteraction(`<@${d._id.user_id}>`, interaction);
        users.push({
          user_id: d._id.user_id,
          username: !member ? sorted[sorted.length - 1].username : getMention.username(member),
          hours: hours,
        });
      }

      onSuccess(users.sort((a, b) => a.user_id.localeCompare(b.user_id)));
    }
    catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Something went wrong! Try again later.' });
    }
  },

  calculate: function(messagesCount, swears) {
    if (swears == 0) return 100;
    let final = Math.floor(100 - ((33.1 * swears) / messagesCount * 3));
    if (final > 100) final = 100;
    else if (final < 0) final = 0;
    return final;
  },
};