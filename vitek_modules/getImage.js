module.exports = {
  getImageAndCheckSize: function(arg, interaction, callback) {
    let userImageUrl;
    const emojiId = arg.match(/<:(\w+):?(\d+)>/);
    const mentionedUser1 = arg.match(/<@!?(\d+)>/);

    // Check if the string is URL or emoji or user mention
    if (emojiId) userImageUrl = `https://cdn.discordapp.com/emojis/${emojiId[2]}.png`;
    else if (!mentionedUser1 || !interaction.guild.members.cache.get(mentionedUser1[1])) userImageUrl = arg;
    else userImageUrl = interaction.guild.members.cache.get(mentionedUser1[1]).user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
    this.checkImageResolution(userImageUrl, () => {
      return callback({ error: null, url: userImageUrl });
    }, () => {
      return callback({ error: 'The image is too large or the parameter is incorrect!', url: userImageUrl });
    });
  },

  // Check if the image's resolution is higher than 4000x4000
  checkImageResolution: function(imageUrl, callback, onError) {
    const https = require('https');
    const imagesize = require('imagesize');
    try {
      const request = https.get(imageUrl, (response) => {
        imagesize(response, (err, result) => {
          if (err) onError();
          else if (result.width > 4000 && result.height > 4000) onError();
          else callback();
          request.destroy();
        });
      });
    }
    catch { onError(); }
  },
};