module.exports = {
  send: function(text, interaction) {
    if (text.length < 2000) interaction.reply({ content: text });
    else interaction.reply({ files: [{ attachment: Buffer.from(text, 'UTF8'), name: 'message.txt' }] });
  },
};