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
        if(w.length > 10) w = w.slice(2, -2);
        else if(w.length > 5) w = w.slice(1, -1);
        else if(w.length == 5) w = w.slice(0, -1);
        re += `(?=[\\s\\S]*${w})`;
      }

      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: {
          server_id: server_id,
          'author.isBot': false,
          $and: [{ 'cleanContent': { $regex: re, $options: 'i' } }, { 'cleanContent': { $not: /^\.|^!/m } }],
        } },
        { $group: {
          _id: null,
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if(!data || data.length == 0) return onResponse(false);

      const items = data[0].cleanContent.filter((item, index) => data[0].cleanContent.indexOf(item) === index);
      const msg = items[Math.floor(Math.random() * items.length)];
      return onResponse(msg.length > 300 ? msg.slice(0, 300) : msg);
    }
    catch (error) {
      console.error(error);
      return onResponse(false);
    }
  },
};