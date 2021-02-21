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

  getDataForDay: async function(date_start, date_stop, server_id, message, onSuccess) {
    try {
      const MessageModel = require('./models/messageModel');
      const getMention = require('../vitek_modules/getMention');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, createdAt: { $gte: date_start, $lt: date_stop } } },
        { $group: {
          _id: {
            user_id: '$author.user_id',
            hour: { $hour: { date: '$createdAt', timezone: 'Europe/Warsaw' } },
            day: { $dayOfYear: '$createdAt' },
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
            day: '$_id.day',
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

      if(!data || data.length == 0) return message.channel.send('There is no data for your date!');

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
        const member = getMention.member(`<@${d._id.user_id}>`, message);
        users.push({
          user_id: d._id.user_id,
          username: !member ? sorted[sorted.length - 1].username : getMention.username(member),
          hours: hours,
        });
      }
      onSuccess(users);
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },

  calculate: function(messages_count, swears, words) {
    const swears_val = swears * 1.2;
    const messages_count_val = (100 * words - swears) / messages_count * 1.05;
    let final = Math.round(100 - ((100 * swears_val) / messages_count_val));

    if(final > 100) final = 100;
    else if(final < 0) final = 0;

    return final;
  },
};