const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('keanu')
    .setDescription('Johnny Silverhand with your image and quote')
    .addStringOption(option =>
      option.setName('line1')
        .setDescription('Enter a top line of text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('line2')
        .setDescription('Enter a bottom line of text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const { MessageAttachment } = require('discord.js');
    await interaction.deferReply();

    const applyText = (canvas, text, startFontSize) => {
      const ctx = canvas.getContext('2d');
      let fontSize = startFontSize;
      do {
        fontSize -= 5;
        ctx.font = `${fontSize}px sans-serif`;
      } while (ctx.measureText(text).width > canvas.width - 50 || fontSize <= 10);
      return ctx.font;
    };

    const line1 = interaction.options.getString('line1');
    const line2 = interaction.options.getString('line2');
    const img = interaction.options.getString('image');
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const canvas = Canvas.createCanvas(1495, 841);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#000000';

      const userImage = await Canvas.loadImage(url);
      const bg = await Canvas.loadImage('images/keanu/keanu.png');
      const x = 657;
      const y = 143;
      const w = 239;
      const h = 381;
      const cx = x + 0.5 * w;
      const cy = y + 0.5 * h;
      const deg = Math.PI / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(20 * deg);
      ctx.translate(-cx, -cy);
      ctx.drawImage(userImage, x, y, w, h);
      ctx.restore();

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = applyText(canvas, line1, 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(line1, (canvas.width / 2) - (ctx.measureText(line1).width / 2), 65);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line1, (canvas.width / 2) - (ctx.measureText(line1).width / 2), 65);

      ctx.font = applyText(canvas, line2, 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(line2, (canvas.width / 2) - (ctx.measureText(line2).width / 2), 776);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line2, (canvas.width / 2) - (ctx.measureText(line2).width / 2), 776);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'keanu.png');
      interaction.editReply({ files: [attachment] });
    });
  },
};