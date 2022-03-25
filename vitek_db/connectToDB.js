module.exports = {
  connectToDB: async function() {
    const mongoose = require('mongoose');
    console.log('\x1b[33m%s\x1b[0m', 'Connecting to mongoDB...');
    require('dotenv').config();
    try {
      await mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('\x1b[32m%s\x1b[0m', 'Connected to mongoDB!');
    }
    catch (error) {
      console.error(error);
      process.exit(1);
    }
  },
};