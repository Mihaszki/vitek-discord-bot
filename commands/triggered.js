const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('triggered')
    .setDescription('Triggered animation')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(500, 600);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(500, 600);
    ctx.fillStyle = '#000000';
    const img = interaction.options.getString('image');
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      const triggered = await Canvas.loadImage('images/triggered/triggered.png');
      const overlay = await Canvas.loadImage('images/triggered/overlay.png');

      encoder.setDelay(30);
      encoder.start();

      const rand = (min = 0, max = 20) => Math.random() * (max - min) + min;
      const triggeredHeight = 100;
      const add = 30;

      for(let i = 0; i < 15; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(user_image, rand() - 15, rand() - 15, add + canvas.width, add + canvas.height - triggeredHeight / 1.5);
        ctx.drawImage(triggered, rand() - 15, canvas.height - triggeredHeight - rand() - 15, add + canvas.width, add + triggeredHeight);
        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
      }

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new MessageAttachment(buffer, 'triggered.gif');
      interaction.editReply({ files: [attachment] });
    });
  },
};