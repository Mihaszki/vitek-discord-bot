module.exports = {
  getRanking: async function(server_id, message) {
    try {
      const MessageModel = require('../vitek_db/models/messageModel');
      const getMention = require('../vitek_modules/getMention');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, 'author.isBot': false } },
        { $group: {
          _id: { 'user_id': '$author.user_id' },
          count: { $sum: 1 },
          swears: { $sum: '$swears' },
          words: { $sum: '$words' },
          tag: { $last: '$author.tag' },
        } },
      ]);

      console.log(data);

      const calculatedData = [];

      for(const user of data) {
        const member = getMention.member(`<@${user._id.user_id}>`, message);
        calculatedData.push({
          username: (!member) ? user.tag : getMention.username(member),
          value: this.calculate(user.count, user.swears, user.words),
        });
      }

      console.log(calculatedData);

      return data.length == 0 ? [] : calculatedData;
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

    console.log(final);

    if(final > 100) final = 100;
    else if(final < 0) final = 0;

    return final;
  },
};