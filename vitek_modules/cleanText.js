module.exports = {
  emojis: function(text) {
    let matches_emoji = text.matchAll(/<:(\w+):?(\d+)>/g);
    for(let match of matches_emoji) {
      text = text.replace(match[0], ':' + match[1] + ':');
    }
    return text;
  },
}