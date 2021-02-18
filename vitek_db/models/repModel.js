const mongoose = require('mongoose');

const repSchema = new mongoose.Schema({
  server_id: String,
  reason: { type: String, default: 'None' },
  value: Number,
  receiver: {
    user_id: String,
    username: String,
    tag: String,
  },
  sender: {
    user_id: String,
    username: String,
    tag: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rep', repSchema);