const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qrcode')
    .setDescription('Generate qr code')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const cleanText = require('../vitek_modules/cleanText');
    const QRCode = require('qrcode');
    const Canvas = require('canvas');
    await interaction.deferReply();
    const text = cleanText.emojis(interaction.options.getString('text'));
    const img = interaction.options.getString('image');

    if (img) {
      getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
        if (error) {
          return interaction.editReply({ content: error });
        }
        generateQr(url);
      });
    }
    else {
      generateQr();
    }

    async function generateQr(customBg = '') {
      const canvas = Canvas.createCanvas(2000, 2000);
      const ctx = canvas.getContext('2d');
      QRCode.toCanvas(
        canvas,
        text,
        {
          errorCorrectionLevel: 'Q',
        },
      );

      if (!customBg) {
        const attachment = new MessageAttachment(canvas.toBuffer(), 'qr.png');
        interaction.editReply({ files: [attachment] });
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i] + data[i + 1] + data[i + 2] < 10) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const canvas2 = Canvas.createCanvas(canvas.width, canvas.height);
      const ctx2 = canvas2.getContext('2d');
      const userImage = await Canvas.loadImage(customBg);
      ctx2.drawImage(userImage, 0, 0, canvas.width, canvas.height);
      ctx2.drawImage(canvas, 0, 0, canvas.width, canvas.height);

      const attachment = new MessageAttachment(canvas2.toBuffer(), 'qr.png');
      interaction.editReply({ files: [attachment] });
    }
  },
};