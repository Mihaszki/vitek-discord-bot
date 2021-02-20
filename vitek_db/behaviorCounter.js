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
        console.log(!member ? user.username : getMention.username(member));
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

  calculate: function(messages_count, swears, words) {
    const swears_val = swears * 1.2;
    const messages_count_val = (100 * words - swears) / messages_count * 1.05;
    let final = Math.round(100 - ((100 * swears_val) / messages_count_val));

    if(final > 100) final = 100;
    else if(final < 0) final = 0;

    return final;
  },
};