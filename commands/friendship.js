const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('friendship')
    .setDescription('Friendship ended with X, now Y is my best friend')
    .addStringOption(option =>
      option.setName('word1')
        .setDescription('Enter a first word')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('word2')
        .setDescription('Enter a second word')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(500, 372);
    const context = canvas.getContext('2d');
    const { drawTextInBox } = require('../vitek_modules/canvasDraw');

    const img = interaction.options.getString('image');
    const word1 = interaction.options.getString('word1').trim().split(' ')[0];
    const word2 = interaction.options.getString('word2').trim().split(' ')[0];

    await interaction.deferReply();

    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const background = await Canvas.loadImage('images/friendship/friendship.png');
      const foreground = await Canvas.loadImage('images/friendship/x.png');
      const userImage = await Canvas.loadImage(url);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.drawImage(userImage, 0, 207, 106, 165);
      context.drawImage(userImage, 361, 225, 139, 147);
      context.drawImage(foreground, 0, 0, canvas.width, canvas.height);

      context.fillStyle = '#a10004';

      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#4da927');
      gradient.addColorStop(1 / 4, '#818419');
      gradient.addColorStop(2 / 4, '#4eb541');
      gradient.addColorStop(3 / 4, '#9f6b15');
      gradient.addColorStop(1, '#5ea026');

      context.shadowColor = '#522f64';
      context.shadowBlur = 1;
      context.lineWidth = 5;
      context.font = '30px sans-serif';
      context.fillStyle = gradient;

      drawTextInBox(context, word1, 'sans-serif', 328, -5, 160, 51);

      const gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient2.addColorStop(0, '#bd5516');
      gradient2.addColorStop(1 / 4, '#bd5516');
      gradient2.addColorStop(2 / 4, '#bd5516');
      gradient2.addColorStop(3 / 4, '#bd5516');
      gradient2.addColorStop(1, '#bd5516');
      context.fillStyle = gradient2;

      drawTextInBox(context, word2, 'sans-serif', 195, 85, 110, 50);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'friendship.png');
      interaction.editReply({ files: [attachment] });
    });
  },
};