const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  server_id:  String,
  name: String,
}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema);