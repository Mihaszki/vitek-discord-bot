module.exports = {
  getRanking: async function(word, server_id, message, onSuccess) {
    const getMention = require('../vitek_modules/getMention');
    try {
      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, 'author.isBot': false, $and: [{ 'cleanContent': { $regex: word, $options: 'i' } }, { 'cleanContent': { $not: /^\./m } }] } },
        { $group: {
          _id: '$author.user_id',
          cleanContent: { $push: '$cleanContent' },
          username: { $last: '$author.username' },
        } },
      ]);

      if(!data || data.length == 0) return message.channel.send('There is no data for the words!');

      const counted_data = [];

      for(const d of data) {
        const str = d.cleanContent.join().toLowerCase();
        const member = getMention.member(`<@${d._id}>`, message);
        counted_data.push({
          username: !member ? d.username : getMention.username(member),
          number: str.split(word).length - 1,
        });
      }

      counted_data.sort((a, b) => (a.number < b.number) ? 1 : -1);
      onSuccess(counted_data.map(a => a.username), counted_data.map(a => a.number));
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },

  getUsage: async function(words, server_id, message, onSuccess) {
    try {
      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: { server_id: server_id, 'author.isBot': false, $and: [{ 'cleanContent': { $regex: words.join('|'), $options: 'i' } }, { 'cleanContent': { $not: /^\./m } }] } },
        { $group: {
          _id: 'null',
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if(!data || data.length == 0) return message.channel.send('There is no data for the words!');

      const str = data[0].cleanContent.join().toLowerCase();

      const counted_data = [];

      words.forEach(word => {
        counted_data.push({
          number: str.split(word).length - 1,
          word: word.length > 10 ? word.slice(0, 10) + '...' : word,
        });
      });
      counted_data.sort((a, b) => (a.number < b.number) ? 1 : -1);
      onSuccess(counted_data.map(a => a.word), counted_data.map(a => a.number));
    }
    catch (error) {
      console.error(error);
      return message.channel.send('Something went wrong! Try again later.');
    }
  },
};