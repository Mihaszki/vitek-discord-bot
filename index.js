const Discord = require('discord.js');
const fs = require('fs');
const config = require('./bot_config.json');
require('dotenv').config();

const client = new Discord.Client();

// Setup commands inside commands folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
const getTimeNow = () => '[' + new Date().toLocaleTimeString() + ']';

client.once('ready', () => {
  console.log('\x1b[33m%s\x1b[0m', `#####################\nREADY! ${client.user.tag}\n#####################`);
  client.user.setActivity(config.activity, { type: 'PLAYING' });
});

client.on('message', message => {
  console.log(`${getTimeNow()} ${message.author.tag}: ${message.content}`);
  if(!message.content.startsWith(config.prefix) || message.author.bot) return;

  // Get arguments from user's input
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if(!command) return;

  // Check if it's guild only command
  if(command.guildOnly && message.channel.type === 'dm') return message.channel.send('I can\'t execute that command inside DMs!');

  if(command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if(command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
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
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    console.log('\x1b[32m%s\x1b[0m', `${getTimeNow()} ${message.author.tag}: ${config.prefix}${command.name}`);
    command.execute(message, args);
	}
  catch (error) {
    console.error(error);
    message.reply(`There was an error trying to execute that command!\n${error}`);
  }
});

// in .env file: BOT_TOKEN=your-bot-token
client.login(process.env.BOT_TOKEN);