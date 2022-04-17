const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const messageLogger = require('./vitek_db/messageLogger');
const messageGenerator = require('./vitek_db/messageGenerator');
const blockListController = require('./vitek_db/blockListController');
const { connectToDB } = require('./vitek_db/connectToDB');
const { prefix, dateLocale, botAuthorId, status } = require('./bot_config');
require('dotenv').config();

// Connect to mongoDB
connectToDB();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// List that will contain blocked users
let blocklist = [];

// Message counter for automatic bot responses
const guildMessageCounter = new Map();
const guildMessageCounterLimits = new Map();

// Load commands from the commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.botRunningUptime = new Date();
const getTimeNow = () => '[' + new Date().toLocaleTimeString(dateLocale) + ']';

client.once('ready', async () => {
  console.log('\x1b[34m%s\x1b[0m', `
  88888880000GGGGGGCCCCCCCCCGGGGGGGGGGCCCCCG
  88888800000GGGGGGCCCCCCCCCGGGGGGGGGCCCCCCG
  80.         iGGGCCCCCCCCCCGGGf         .CG
  08L          fGGCCCCCCCCCGGGG.         fCG
  008i         .GGCCCCCCCCCGGGi         iCCG
  0000.         iGCCCCCCCCCGGL         .CCCG
  0008C          LCCCCCCCCGG0,         fCCCG
  000081         ,CCCCCCCCGG1         iCCCCG
  000008,         1CCCCCCCGC         ,CCCCCG
  000008G          CCCCCCG0,         LCCCCCG
  0000008t         :CCCCGGt         1CCCCCCG
  00080008:         tCCCGG         :CCCCCCCG
  00888008G          CCG0:         CGGCCCCCG
  008888008t         ;CGf         tGGGCCCCCG
  0088880088;         fG.        :GGGGGCCCCG
  08888880080         .;        .CGGGGGCCCCG
  08888880008f                  fGGGGGGGCCGG
  888888800008;                ;GG00GGGGGGGG
  8888888000000.              .G00000GGGGGGG
  8888880000008L              L0000000GGGGGG
  88888000000008i            iG0000000GGGGGG
  888800000000000.          ,G00000000GGGGGG
  8888000000000000CCCCCCCCCCG000088000GGGGGG
  8880000000000000000000000G0000000000GGGGGG`);
  console.log('\x1b[34m%s\x1b[0m', `  ${client.user.tag}`);
  // Get blocked users to the block list
  blocklist = await blockListController.getBlockedUsers();
  console.log('\x1b[33m%s\x1b[0m', 'Blocked users:');
  console.log(blocklist);
  for (const g of client.guilds.cache) {
    console.log('\x1b[33m%s\x1b[0m', 'Serving on:');
    console.log('\x1b[33m%s\x1b[0m', `${g}`);
  }
  client.user.setActivity(status, { type: 'WATCHING' });

});

client.on('messageCreate', async message => {
  // Save the message to the database
  messageLogger.saveMessage(message);
  console.log(`${getTimeNow()} ${message.author.tag}: ${message.content}`);

  if (message.author.id == botAuthorId && message.content.split(' ')[0] == './blockuser') {
    console.log(message.author.bot, botAuthorId, message.content.split(' ')[1]);
    await blockListController.toggleBlock(message.content.split(' ')[1], message.guild.id);
    blocklist = await blockListController.getBlockedUsers();
    console.log('\x1b[33m%s\x1b[0m', 'Blocked users:');
    console.log(blocklist);
    return;
  }
  else if (message.author.id === botAuthorId && message.content.split(' ')[0] === './talkmode') {
    guildMessageCounterLimits['_' + message.guild.id] = guildMessageCounterLimits['_' + message.guild.id] ? false : true;
    return;
  }
  else if (!blockListController.isBlockedLocal(message.author.id, blocklist) && message.content[0] === '.' && message.content.length > 1 && !message.author.bot) {
    console.log(message.cleanContent.slice(1));
    return messageGenerator.getMessage(message.cleanContent.slice(1), message.guild.id, response => {
      if (response !== false) message.channel.send(response);
    }, true, 2000);
  }
  else if(!blockListController.isBlockedLocal(message.author.id, blocklist)) {
    // Allow the bot to reply to mentions
    const botMention = message.mentions.users.find(x => x.id === message.client.user.id);
    if(botMention) {
      return messageGenerator.getMessage(message.cleanContent.replace(new RegExp(`@​${message.client.user.username}`, 'g'), '') || 'a', message.guild.id, response => {
        if (response !== false) message.channel.send(response);
      }, true, 2000);
    }
  }

  // Emoji reaction on a private server
  if (message.guild.id === '771628652533514251' && message.channel.id === '771689939875790868') {
    if (message.attachments.first()) {
      message.react('955484551818395719')
        .then(() => message.react('953313703745421363'))
        .catch(() => console.error('One of the emojis failed to react.'));
    }
  }

  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) {
    guildMessageCounter['_' + message.guild.id] = (guildMessageCounter['_' + message.guild.id] + 1) || 1;
    if (guildMessageCounter['_' + message.guild.id] % 100 === 0 || guildMessageCounterLimits['_' + message.guild.id] === true) {
      messageGenerator.getMessage(message.cleanContent, message.guild.id, response => {
        if (response !== false) message.channel.send(response);
        guildMessageCounter['_' + message.guild.id] = 1;
      });
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (blockListController.isBlockedLocal(interaction.user.id, blocklist)) {
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