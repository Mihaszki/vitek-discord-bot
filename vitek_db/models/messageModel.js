const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  server_id: String,
  message_id: String,
  content: String,
  cleanContent: String,
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