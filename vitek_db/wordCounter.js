module.exports = {
  getRanking: async function(word, serverId, interaction, onSuccess, escapeString = true) {
    try {
      const getMention = require('../vitek_modules/getMention');
      const { escapeRegex } = require('../vitek_modules/escapeRegex');
      let wordParsed = word;
      if (escapeString) wordParsed = escapeRegex(wordParsed);
      const MessageModel = require('./models/messageModel');
      const data = await MessageModel.aggregate([
        { $match: {
          server_id: serverId,
          'author.isBot': false,
          $and: [{ 'cleanContent': { $regex: wordParsed, $options: 'i' } },
            { 'cleanContent': { $not: /^\.|^!/m } }],
        } },
        { $group: {
          _id: '$author.user_id',
          cleanContent: { $push: '$cleanContent' },
          username: { $last: '$author.username' },
        } },
      ]);

      if (!data || data.length == 0) return interaction.editReply({ content: 'There is no data for the words!' });

      const countedData = [];

      for (const d of data) {
        const str = d.cleanContent.join().toLowerCase();
        const member = getMention.memberInteraction(`<@${d._id}>`, interaction);
        countedData.push({
          username: !member ? d.username : getMention.username(member),
          number: str.split(word).length - 1,
        });
      }

      countedData.sort((a, b) => (a.number < b.number) ? 1 : -1);
      onSuccess(countedData.map(a => a.username), countedData.map(a => a.number));
    }
    catch (error) {
      console.error(error);
    }
  },

  getUsage: async function(words, serverId, interaction, onSuccess, escapeString = true) {
    try {
      const { excludeRegex } = require('../bot_config');
      const MessageModel = require('./models/messageModel');
      const { escapeRegex } = require('../vitek_modules/escapeRegex');
      let wordsParsed = words;
      if (escapeString) {
        wordsParsed = wordsParsed.map(string => escapeRegex(string));
      }
      const data = await MessageModel.aggregate([
        { $match: { server_id: serverId,
          'author.isBot': false,
          $and: [{ 'cleanContent': { $regex: wordsParsed.join('|'), $options: 'i' } },
            { 'cleanContent': { $not: excludeRegex } }],
        } },
        { $group: {
          _id: 'null',
          cleanContent: { $push: '$cleanContent' },
        } },
      ]);

      if (!data || data.length == 0) return interaction.editReply({ content: 'There is no data for the words!' });

      const str = data[0].cleanContent.join().toLowerCase();

      const countedData = [];

      words.forEach(word => {
        countedData.push({
          number: str.split(word).length - 1,
          word: word,
        });
      });
      countedData.sort((a, b) => (a.number < b.number) ? 1 : -1);
      onSuccess(countedData.map(a => a.word), countedData.map(a => a.number));
    }
    catch (error) {
      console.error(error);
    }
  },
};