const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a vote')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Enter a text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option1')
        .setDescription('Enter an option 1')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option2')
        .setDescription('Enter an option 2')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option3')
        .setDescription('Enter an option 3')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option4')
        .setDescription('Enter an option 4')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option5')
        .setDescription('Enter an option 5')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option6')
        .setDescription('Enter an option 6')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option7')
        .setDescription('Enter an option 7')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option8')
        .setDescription('Enter an option 8')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option9')
        .setDescription('Enter an option 9')
        .setRequired(false)),
  async execute(interaction) {
    const { MessageEmbed } = require('discord.js');
    const { guildIcon, avatar, username } = require('../vitek_modules/getMention');

    const title = interaction.options.getString('question');

    const sliceText = (str, len = 1000) => str > len ? str.slice(0, len) + '...' : str;

    let desc = ''; 
    const fields = [];

    const emojis = {
      0: '0⃣', 1: '1⃣',
      2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣',
      6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣',
    };

    let emojiIndex = 1;

    const checkDuplicates = [];
  
    for(let i = 1; i <= 9; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if(!opt) {continue;}

      if(i > 1) {
        if(checkDuplicates.includes(opt)) {
          return await interaction.reply({ content: 'There are duplicates in your options!' });
        }
      }

      checkDuplicates.push(opt);

      fields.push({ name: emojis[emojiIndex], value: sliceText(opt), inline: true });
      emojiIndex++;
    }

    const embed = new MessageEmbed()
    .setColor('#00aeff')
    .setDescription(desc)
    .setAuthor({
      name: username(interaction.user),
      iconURL: avatar(interaction.user),
    })
    .setTitle(sliceText(title, 200))
    .setThumbnail(guildIcon(interaction))
    .addFields(...fields);

    emojiIndex = 1;
    const message = await interaction.reply({ embeds: [embed], fetchReply: true });

    for(let i = 1; i <= 9; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if(!opt) {continue;}

      try {
        await message.react(emojis[emojiIndex]);
        emojiIndex++;
      } catch (error) {
        console.error('Emoji failed to react:', error);
      }
    }
  },
};