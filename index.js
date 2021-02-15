const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const { prefix } = require('./bot_config.json');

client.once('ready', () => {
  console.log('Ready!');
});

// in .env file: BOT_TOKEN=your-bot-token
client.login(process.env.BOT_TOKEN);