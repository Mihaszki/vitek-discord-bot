module.exports = {
  emojis: function(text) {
    const matchesEmoji = text.matchAll(/<:(\w+):?(\d+)>/g);
    for (const match of matchesEmoji) {
      text = text.replace(match[0], ':' + match[1] + ':');
    }
    return text;
  },
};