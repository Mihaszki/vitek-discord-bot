const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mbooba')
    .setDescription('mbooba animation')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const fs = require('fs');
    const canvas = Canvas.createCanvas(324, 112);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(324, 112);
    const img = interaction.options.getString('image');
    ctx.fillStyle = '#36393E';
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }

      fs.readdir('images/mbooba', async (err, files) => {
        if(err) {
          console.log(err);
          return interaction.editReply({ content: 'There was an error while loading files!' });
        }
        const userImage = await Canvas.loadImage(url);
        encoder.start();
        for(let i = 0; i < files.length; i++) {
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          encoder.setDelay(parseFloat(files[i].match(/\d+(\.\d+)?s/)[0]) * 1000);
          const frame = await Canvas.loadImage(`images/mbooba/${files[i]}`);
          ctx.drawImage(frame, 0, 0, 112, 112);
          ctx.drawImage(userImage, canvas.width - 112, 0, 112, 112);
          encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = encoder.out.getData();
        const attachment = new MessageAttachment(buffer, 'mbooba.gif');
        interaction.editReply({ files: [attachment] });
      });
    });
  },
};