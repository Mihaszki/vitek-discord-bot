const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pop')
    .setDescription('Pop cat animation')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(398, 392);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(398, 392);
    ctx.fillStyle = '#000000';
    const img = interaction.options.getString('image');
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const userImage = await Canvas.loadImage(url);

      const frame1 = await Canvas.loadImage('images/pop/frame1.png');
      const frame2 = await Canvas.loadImage('images/pop/frame2.png');

      encoder.setDelay(50);
      encoder.start();

      // 1
      ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 2
      ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 3
      ctx.fillRect(165, 133, 144, 136);
      ctx.drawImage(userImage, 165, 133, 144, 136);
      ctx.drawImage(frame2, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 4
      ctx.fillRect(165, 133, 144, 136);
      ctx.drawImage(userImage, 165, 133, 144, 136);
      ctx.drawImage(frame2, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new MessageAttachment(buffer, 'pop.gif');
      interaction.editReply({ files: [attachment] });
    });
  },
};