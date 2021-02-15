module.exports = {
  getImageAndCheckSize: function(arg, message, onSuccess) {
    let user_image_url;
    const emoji_id = arg.match(/<:(\w+):?(\d+)>/);
    const mentioned_user1 = arg.match(/<@!?(\d+)>/);

    if(emoji_id) user_image_url = `https://cdn.discordapp.com/emojis/${emoji_id[2]}.png`;
    else if(!mentioned_user1 || !message.guild.member(mentioned_user1[1])) user_image_url = arg;
    else user_image_url = message.guild.members.cache.get(mentioned_user1[1]).user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';

    this.checkImageResolution(user_image_url, () => {
      return onSuccess(user_image_url);
    }, () => {
      return message.channel.send('The image is too large or the parameter is incorrect!');
    });
  },

  checkImageResolution: function(imageUrl, onSuccess, onError) {
    const https = require('https');
    const imagesize = require('imagesize');
    try {
      const request = https.get(imageUrl, (response) => {
        imagesize(response, (err, result) => {
          if(err) onError();
          else if(result.width > 4000 && result.height > 4000) onError();
          else onSuccess();
          request.abort();
        });
      });
    }
    catch { onError(); }
  },
};