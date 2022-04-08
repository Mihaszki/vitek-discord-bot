const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gigachad')
    .setDescription('Gigachad animation')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(300, 300);
    ctx.fillStyle = '#646464';
    const img = interaction.options.getString('image');
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const userImage = await Canvas.loadImage(url);
      const p1 = await Canvas.loadImage('images/gigachad/p1.png');
      const p2 = await Canvas.loadImage('images/gigachad/p2.png');
      const p3 = await Canvas.loadImage('images/gigachad/p3.png');
      const p4 = await Canvas.loadImage('images/gigachad/p4.png');
      const mask1 = await Canvas.loadImage('images/gigachad/mask1.png');
      const mask2 = await Canvas.loadImage('images/gigachad/mask2.png');
      const mask3 = await Canvas.loadImage('images/gigachad/mask3.png');
      const mask4 = await Canvas.loadImage('images/gigachad/mask4.png');

      const greyScaleCanvas = Canvas.createCanvas(500, 500);
      const greyScaleCtx = greyScaleCanvas.getContext('2d');

      greyScaleCtx.drawImage(userImage, 0, 0, greyScaleCanvas.width, greyScaleCanvas.height);
      const imageData = greyScaleCtx.getImageData(0, 0, greyScaleCanvas.width, greyScaleCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      greyScaleCtx.putImageData(imageData, 0, 0);

      let x = -216;
      let y = -54;
      let imgW = 379;
      let imgH = 379;
      let userX = -165;
      let userY = 33;
      let userImgW = 240;
      let userImgH = 233;

      const framesPerLoop = 20;
      const move = 5;

      encoder.setQuality(30);
      encoder.setDelay(85);
      encoder.start();

      for (let i = 0; i < framesPerLoop; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(greyScaleCanvas, userX, userY, userImgW, userImgH);
        ctx.drawImage(mask1, x, y, imgW, imgH);
        ctx.drawImage(p1, x, y, imgW, imgH);
        encoder.addFrame(ctx);
        x += move;
        userX += move;
      }

      x = -159;
      y = -63;
      imgW = 634;
      imgH = 536;
      userX = 48;
      userY = 25;
      userImgW = 133;
      userImgH = 153;

      for (let i = 0; i < framesPerLoop; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(greyScaleCanvas, userX, userY, userImgW, userImgH);
        ctx.drawImage(mask2, x, y, imgW, imgH);
        ctx.drawImage(p2, x, y, imgW, imgH);
        encoder.addFrame(ctx);
        y -= move;
        userY -= move;
      }

      x = 146;
      y = -25;
      imgW = 247;
      imgH = 404;
      userX = 196;
      userY = 9;
      userImgW = 132;
      userImgH = 194;

      for (let i = 0; i < framesPerLoop; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(greyScaleCanvas, userX, userY, userImgW, userImgH);
        ctx.drawImage(mask3, x, y, imgW, imgH);
        ctx.drawImage(p3, x, y, imgW, imgH);
        encoder.addFrame(ctx);
        x -= move;
        userX -= move;
      }

      x = -24;
      y = -94;
      imgW = 338;
      imgH = 396;
      userX = 71;
      userY = -68;
      userImgW = 138;
      userImgH = 203;

      for (let i = 0; i < framesPerLoop; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(greyScaleCanvas, userX, userY, userImgW, userImgH);
        ctx.drawImage(mask4, x, y, imgW, imgH);
        ctx.drawImage(p4, x, y, imgW, imgH);
        encoder.addFrame(ctx);
        y += move;
        userY += move;
      }

      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new MessageAttachment(buffer, 'gigachad.gif');
      interaction.editReply({ files: [attachment] });
    });
  },
};