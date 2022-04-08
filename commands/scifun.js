const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scifun')
    .setDescription('Scifun animation')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(290, 280);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(290, 280);
    ctx.fillStyle = '#e26861';
    const img = interaction.options.getString('image');
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const userImage = await Canvas.loadImage(url);

      const x = 77;
      const y = 153;
      let rotation = 0;
      const w = 79;
      const h = 82;
      const cx = x + 0.5 * w;
      const cy = y + 0.5 * h;
      const deg = Math.PI / 180;

      encoder.setQuality(30);
      encoder.setDelay(40);
      encoder.start();

      for (let i = 1; i <= 167; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const usrImg = await Canvas.loadImage(`images/scifun/frame(${i}).png`);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation * deg);
        ctx.translate(-cx, -cy);
        rotation = rotation + (i / 2);
        ctx.drawImage(userImage, x, y, w, h);
        ctx.restore();
        ctx.drawImage(usrImg, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new MessageAttachment(buffer, 'scifun.gif');
      interaction.editReply({ files: [attachment] });
    });
  },
};