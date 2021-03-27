const Discord = require('discord.js');
const fs = require('fs');
const messageLogger = require('./vitek_db/messageLogger');
const messageGenerator = require('./vitek_db/messageGenerator');
const { connectToDB } = require('./vitek_db/connectToDB');
const { prefix, status, date_locale } = require('./bot_config');
require('dotenv').config();

// Connect to mongoDB
connectToDB();

const client = new Discord.Client();

// Message counter for automatic bot responses
const guildMessageCounter = new Map();

// Setup commands inside commands folder
client.commands = new Discord.Collection();
client.botRunningUptime = new Date();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
const getTimeNow = () => '[' + new Date().toLocaleTimeString(date_locale) + ']';

client.once('ready', () => {
  console.log('\x1b[33m%s\x1b[0m', `########\nREADY! ${client.user.tag}\n########`);
  for(const g of client.guilds.cache) {
    console.log('\x1b[33m%s\x1b[0m', 'Serving on:');
    console.log('\x1b[33m%s\x1b[0m', `${g}`);
  }
  client.user.setActivity(status, { type: 'PLAYING' });
});

client.on('message', message => {
  messageLogger.saveMessage(message);
  console.log(`${getTimeNow()} ${message.author.tag}: ${message.content}`);
  if(message.guild.id === '771628652533514251' && message.channel.id === '771689939875790868') {
    if(message.attachments.first()) {
      message.react('771685520455368705')
        .then(() => message.react('771685939013222411'))
        .catch(() => console.error('One of the emojis failed to react.'));
    }
  }
  if(!message.content.startsWith(prefix)) {
    if(message.author.bot) return;
    guildMessageCounter['_' + message.guild.id] = (guildMessageCounter['_' + message.guild.id] + 1) || 1;
    if(guildMessageCounter['_' + message.guild.id] % 100 === 0) {
      messageGenerator.getMessage(message.cleanContent, message.guild.id, response => {
        if(response !== false) message.channel.send(response);
        guildMessageCounter['_' + message.guild.id] = 1;
      });
    }
    return;
  }
  if(message.author.bot) {return;}

  // Get arguments from user's input
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if(!command) {
    messageGenerator.getMessage(message.cleanContent.slice(1), message.guild.id, response => {
      if(response !== false) message.channel.send(response);
    });
    return;
  }

  // Check if it's guild only command
  if(command.guildOnly && message.channel.type === 'dm') return message.channel.send('I can\'t execute that command inside DMs! :man_shrugging:');

  if(command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if(command.usage) {
      reply += `\n:wrench: Proper usage: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if(!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if(timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if(now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the \`${command.name}\` command. :clock1:`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    console.log('\x1b[32m%s\x1b[0m', `${getTimeNow()} ${message.author.tag}: ${prefix}${command.name}`);
    command.execute(message, args);
  }
  catch (error) {
    console.error(error);
    message.reply(`There was an error trying to execute that command!\n\`\`\`${error}\`\`\``);
  }
});

// in .env file: BOT_TOKEN=your-bot-token
client.login(process.env.BOT_TOKEN);