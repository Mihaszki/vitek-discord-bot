module.exports = {
  getMessage: async function(text, server_id, onResponse, escapeString = true, sliceLen = 300, getRandomIfDataNotFound = false) {
    try {
      const { excludeRegex } = require('../bot_config');
      const { escapeRegex } = require('../vitek_modules/escapeRegex');
      const wordCounts = {};
      const parsedText = text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/\?|!|\.|,/g, '');
      if(!parsedText || !parsedText.replace(/\s/g, '').length) return onResponse(false);
      const words = parsedText.split(' ');

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
        if(escapeString) w = escapeRegex(w);
        re += `(?=[\\s\\S]*${w})`;
      }

      const sliceMsg = str => str.length > sliceLen ? str.slice(0, sliceLen) : str;

      const randomMsg = async () => {
        const MessageModel = require('./models/messageModel');
        const count = await MessageModel.where({
          'server_id': server_id,
          'author.isBot': false,
          $and: [
            { 'cleanContent': { $not: excludeRegex } },
            { 'cleanContent': { $ne: '' } },
          ],
        }).countDocuments();
        const msg = await MessageModel.findOne({
          'server_id': server_id,
          'author.isBot': false,
          $and: [
            { 'cleanContent': { $not: excludeRegex } },
            { 'cleanContent': { $ne: '' } },
          ],
        }).skip(Math.floor(Math.random() * count)).exec();
        return msg.cleanContent;
      };

      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: {
          server_id: server_id,
          'author.isBot': false,
          $and: [
            { 'cleanContent': { $regex: re, $options: 'i' } },
            { 'cleanContent': { $not: excludeRegex } },
          ],
        } },
        { $group: {
          _id: null,
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if(!data || data.length == 0) {
        if(getRandomIfDataNotFound) return onResponse(sliceMsg(await randomMsg()));
        this.getMessage(wordlist[0], server_id, response => {
          if(response !== false) return onResponse(sliceMsg(response));
        }, true, sliceLen, true);
        if(!getRandomIfDataNotFound) return;
      }

      const items = data[0].cleanContent.filter((item, index) => data[0].cleanContent.indexOf(item) === index);
      const index = items.indexOf(text);
      if (index != -1) {
        items.splice(index, 1);
      }
      if(items.length == 0) return onResponse(sliceMsg(await randomMsg()));
      const msg = items[Math.floor(Math.random() * items.length)];

      if(msg === text) return onResponse(sliceMsg(await randomMsg()));
      else return onResponse(sliceMsg(msg));
    }
    catch (error) {
      console.error(error);
      return onResponse(false);
    }
  },
};