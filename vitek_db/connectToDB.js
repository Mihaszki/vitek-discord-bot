module.exports = {
  connectToDB: async function() {
    const mongoose = require('mongoose');
    require('dotenv').config();
    try {
      await mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('\x1b[33m%s\x1b[0m', '########\nConnected to mongoDB\n########');
    }
    catch (error) {
      console.error(error);
      process.exit(1);
    }
  },
};