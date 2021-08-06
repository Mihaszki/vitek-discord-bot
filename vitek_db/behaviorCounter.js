module.exports = {
  getRanking: async function(server_id, message, onSuccess) {
    try {
      const MessageModel = require('./models/messageModel');
      const getMention = require('../vitek_modules/getMention');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, 'author.isBot': false } },
        { $group: {
          _id: { 'user_id': '$author.user_id' },
          count: { $sum: 1 },
          swears: { $sum: '$swears' },
          words: { $sum: '$words' },
          username: { $last: '$author.username' },
        } },
      ]);

      let calculatedData = [];

      for(const user of data) {
        const member = getMention.member(`<@${user._id.user_id}>`, message);
        calculatedData.push({
          username: !member ? user.username : getMention.username(member),
          value: this.calculate(user.count, user.swears, user.words),
        });
      }

      if(data.length == 0) return onSuccess([], []);
      calculatedData = calculatedData.sort((a, b) => (a.value < b.value) ? 1 : -1).slice(0, 15);
      onSuccess(calculatedData.map(a => a.value), calculatedData.map(a => a.username));
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },

  getAvailableDates: async function(server_id, interaction, onSuccess) {
    try {
      const { date_timezone, date_locale } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: date_timezone } },
        } },
        { $sort: { '_id': -1 } },
      ]);
      const dates = [];
      if(!data || data.length == 0) return onSuccess([ 'No data.' ]);
      data.forEach(item => {
        dates.push(new Date(item._id).toLocaleDateString(date_locale).replace(/\//g, '.'));
      });
      onSuccess(dates);
    }
    catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Something went wrong! Try again later.' });
    }
  },

  getDataForDay: async function(date, server_id, interaction, onSuccess) {
    try {
      const { endOfDay, startOfDay } = require('date-fns');
      const { date_timezone } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const getMention = require('../vitek_modules/getMention');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, 'author.isBot': false, createdAt: { $gte: startOfDay(date), $lte: endOfDay(date) } } },
        { $group: {
          _id: {
            user_id: '$author.user_id',
            hour: { $hour: { date: '$createdAt', timezone: date_timezone } },
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

      if(!data || data.length == 0) return interaction.editReply({ content: 'There is no data for your date!' });

      const users = [];
      for(const d of data) {
        const hours = [];
        const sorted = d.hours.sort((a, b) => (a.hour > b.hour) ? 1 : -1);
        sorted.forEach(hour => {
          hours.push({
            hour: hour.hour,
            date: hour.date,
            value: this.calculate(hour.count, hour.swears, hour.words),
          });
        });
        const member = getMention.member_interaction(`<@${d._id.user_id}>`, interaction);
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

  calculate: function(messages_count, swears) {
    if(swears == 0) return 100;
    let final = Math.floor(100 - ((33.1 * swears) / messages_count * 3));
    if(final > 100) final = 100;
    else if(final < 0) final = 0;
    return final;
  },
};