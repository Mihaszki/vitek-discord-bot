module.exports = {
  emojis: function(text) {
    const matches_emoji = text.matchAll(/<:(\w+):?(\d+)>/g);
    for(const match of matches_emoji) {
      text = text.replace(match[0], ':' + match[1] + ':');
    }
    return text;
  },
};