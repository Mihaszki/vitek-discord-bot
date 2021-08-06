const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const messageLogger = require('./vitek_db/messageLogger');
const messageGenerator = require('./vitek_db/messageGenerator');
const blockListController = require('./vitek_db/blockListController');
const { connectToDB } = require('./vitek_db/connectToDB');
const { prefix, date_locale, status } = require('./bot_config');
require('dotenv').config();

// Connect to mongoDB
connectToDB();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// List that will contain blocked users
client.blocklist = [];

// Message counter for automatic bot responses
const guildMessageCounter = new Map();

// Load commands from the commands folder
client.commands = new Collection();
client.botRunningUptime = new Date();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const getTimeNow = () => '[' + new Date().toLocaleTimeString(date_locale) + ']';

client.once('ready', async () => {
  // Get blocked users to the block list
  client.blocklist = await blockListController.getBlockedUsers();
  console.log('\x1b[33m%s\x1b[0m', 'Blocked users:');
  console.log(client.blocklist);
  console.log('\x1b[33m%s\x1b[0m', `########\nREADY! ${client.user.tag}\n########`);
  for(const g of client.guilds.cache) {
    console.log('\x1b[33m%s\x1b[0m', 'Serving on:');
    console.log('\x1b[33m%s\x1b[0m', `${g}`);
  }
  client.user.setActivity(status, { type: 'WATCHING' });

  const data = [];
  client.commands.forEach((value) => {
    data.push({
      name: value.name,
      description: value.description,
      options: value.options ? value.options : undefined,
    });
  });

  // Register slash commands
  await client.application.commands.set(data);
});

client.on('messageCreate', message => {
  // Save the message to the database
  messageLogger.saveMessage(message);
  console.log(`${getTimeNow()} ${message.author.tag}: ${message.content}`);
  // Emoji reaction on a private server
  if(message.guild.id === '771628652533514251' && message.channel.id === '771689939875790868') {
    if(message.attachments.first()) {
      message.react('771685520455368705')
        .then(() => message.react('771685939013222411'))
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

  if (!client.commands.has(interaction.commandName)) return;

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  }
  catch (error) {
    console.error(error);
    return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// in .env file: BOT_TOKEN=your-bot-token
client.login(process.env.BOT_TOKEN);