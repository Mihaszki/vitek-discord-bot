module.exports = {
  escapeRegex: function(text) {
    return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  },
};