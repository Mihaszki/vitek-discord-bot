const mongoose = require('mongoose');

const blockListSchema = new mongoose.Schema({
  server_id: String,
  user_id: String,
  isBlocked: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Blocklist', blockListSchema);