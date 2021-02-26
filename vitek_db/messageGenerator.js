module.exports = {
  getMessage: async function(text, server_id, onResponse) {
    try {
      const wordCounts = {};
      text = text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/\?|!|\.|,/g, '');
      if(!text || !text.replace(/\s/g, '').length) return onResponse(false);
      const words = text.split(' ');

      for(let i = 0; i < words.length; i++) {
        wordCounts['_' + words[i]] = (wordCounts['_' + words[i]] || 0) + 1;
      }

      const wordlist = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).map(el=>el[0].slice(1)).slice(0, 3);
      let re = '^';
      for(let w of wordlist) {
        if(w.length > 20) w = w.slice(3, -3);
        else if(w.length > 10) w = w.slice(2, -2);
        else if(w.length > 5) w = w.slice(1, -1);
        else if(w.length == 5 || w.length == 2) w = w.slice(0, -1);
        re += `(?=[\\s\\S]*${w})`;
      }

      const sliceMsg = str => str.length > 300 ? str.slice(0, 300) : str;
      const excludeRegex = /^\.|^!/m;

      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: {
          server_id: server_id,
          'author.isBot': false,
          $and: [{ 'cleanContent': { $regex: re, $options: 'i' } }, { 'cleanContent': { $not: excludeRegex } }],
        } },
        { $group: {
          _id: null,
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if(!data || data.length == 0) {
        const count = await MessageModel.where({
          'server_id': server_id,
          'author.isBot': false,
          'cleanContent': { $not: excludeRegex },
        }).countDocuments();
        const msg = await MessageModel.findOne({
          'server_id': server_id,
          'author.isBot': false,
          'cleanContent': { $not: excludeRegex },
        }).skip(Math.floor(Math.random() * count)).exec();
        return onResponse(sliceMsg(msg.cleanContent));
      }

      const items = data[0].cleanContent.filter((item, index) => data[0].cleanContent.indexOf(item) === index);
      const msg = items[Math.floor(Math.random() * items.length)];
      return onResponse(sliceMsg(msg));
    }
    catch (error) {
      console.error(error);
      return onResponse(false);
    }
  },
};