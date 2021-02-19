const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  server_id: String,
  server_name: String,
  channel_id: String,
  channel_name: String,
  message_id: String,
  content: String,
  cleanContent: String,
  swears: Number,
  words: Number,
  author: {
    user_id: String,
    username: String,
    tag: String,
    isBot: Boolean,
  },
  attachments: [{
    url: String,
    name: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);