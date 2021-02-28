module.exports = {
  getMessages: async function(rhyme, server_id) {
    try {
      const { excludeRegex } = require('../bot_config');

      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: {
          server_id: server_id,
          'author.isBot': false,
          $and: [{ 'cleanContent': { $regex: rhyme, $options: 'im' } }, { 'cleanContent': { $not: excludeRegex } }],
        } },
        { $group: {
          _id: null,
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if(!data || data.length == 0) return false;

      const elements = data[0].cleanContent.filter((item, index) => data[0].cleanContent.indexOf(item) === index);
      if(elements.length < 4) return false;
      const messages = getRandom(elements, 4);
      return messages.map(str => str.trim().replace(/\s+/g, ' '));
    }
    catch (error) {
      console.error(error);
      return false;
    }

    function getRandom(arr, n) {
      const result = new Array(n);
      let len = arr.length;
      const taken = new Array(len);
      const slice = str => str.length > 60 ? str.slice(40) : str;
      if (n > len) throw new RangeError('getRandom: more elements taken than available');
      while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = slice(arr[x in taken ? taken[x] : x]);
        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    }
  },
};