const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const messageLogger = require('./vitek_db/messageLogger');
const messageGenerator = require('./vitek_db/messageGenerator');
const blockListController = require('./vitek_db/blockListController');
const { connectToDB } = require('./vitek_db/connectToDB');
const { prefix, date_locale, bot_author_id, status } = require('./bot_config');
require('dotenv').config();

// Connect to mongoDB
connectToDB();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// List that will contain blocked users
let blocklist = [];

// Message counter for automatic bot responses
const guildMessageCounter = new Map();

// Load commands from the commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.botRunningUptime = new Date();
const getTimeNow = () => '[' + new Date().toLocaleTimeString(date_locale) + ']';

client.once('ready', async () => {
  // Get blocked users to the block list
  blocklist = await blockListController.getBlockedUsers();
  console.log('\x1b[33m%s\x1b[0m', 'Blocked users:');
  console.log(blocklist);
  console.log('\x1b[32m%s\x1b[0m', `########\nREADY! ${client.user.tag}\n########`);
  for(const g of client.guilds.cache) {
    console.log('\x1b[33m%s\x1b[0m', 'Serving on:');
    console.log('\x1b[33m%s\x1b[0m', `${g}`);
  }
  client.user.setActivity(status, { type: 'WATCHING' });

});

client.on('messageCreate', async message => {
  // Save the message to the database
  messageLogger.saveMessage(message);
  console.log(`${getTimeNow()} ${message.author.tag}: ${message.content}`);

  if(message.author.id == bot_author_id && message.content.split(' ')[0] == './blockuser') {
    console.log(message.author.bot, bot_author_id, message.content.split(' ')[1]);
    await blockListController.toggleBlock(message.author.id, message.guild.id);
    blocklist = await blockListController.getBlockedUsers();
    console.log('\x1b[33m%s\x1b[0m', 'Blocked users:');
    console.log(blocklist);
    return;
  }
  else if(!blockListController.isBlockedLocal(message.author.id, blocklist) && message.content[0] == '.' && message.content.length > 1 && !message.author.bot) {
    console.log(message.cleanContent.slice(1));
    return messageGenerator.getMessage(message.cleanContent.slice(1), message.guild.id, response => {
      if(response !== false) message.channel.send(response);
    }, true, 2000);
  }

  // Emoji reaction on a private server
  if(message.guild.id === '771628652533514251' && message.channel.id === '771689939875790868') {
    if(message.attachments.first()) {
      message.react('957255284248690708')
        .then(() => message.react('957255284248690708'))
        .catch(() => console.error('One of the emojis failed to react.'));
    }
  }

  if(message.author.bot) return;

  if(!message.content.startsWith(prefix)) {
    guildMessageCounter['_' + message.guild.id] = (guildMessageCounter['_' + message.guild.id] + 1) || 1;
    if(guildMessageCounter['_' + message.guild.id] % 100 === 0) {
      messageGenerator.getMessage(message.cleanContent, message.guild.id, response => {
        if(response !== false) message.channel.send(response);
        guildMessageCounter['_' + message.guild.id] = 1;
      });
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if(blockListController.isBlockedLocal(interaction.user.id, blocklist)) {
    return await interaction.reply({ content: 'You are blocked!', ephemeral: true });
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    console.log('\x1b[36m%s\x1b[0m', `${getTimeNow()} ${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// in .env file: BOT_TOKEN=your-bot-token
client.login(process.env.BOT_TOKEN);