module.exports = {
  send: function(text, message) {
    if(text.length < 2000) message.channel.send(text);
    else message.channel.send({ files: [{ attachment: Buffer.from(text, 'UTF8'), name: 'message.txt' }] });
  },
};