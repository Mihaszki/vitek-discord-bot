const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trollge')
    .setDescription('Trollge animation')
    .addStringOption(option =>
      option.setName('text1')
        .setDescription('Enter a text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('text2')
        .setDescription('Enter a second text')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(637, 358);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    const encoder = new GIFEncoder(637, 358);
    ctx.fillStyle = '#e26861';

    await interaction.deferReply();

    const text1 = interaction.options.getString('text1');
    const text2 = interaction.options.getString('text2');

    if(text1.length > 148) {
      return interaction.editReply({ content: 'The first text is too long!' });
    }
    else if(text2.length > 148) {
      return interaction.editReply({ content: 'The second text is too long!' });
    }

    encoder.setQuality(30);
    encoder.setDelay(100);
    encoder.start();

    let opacityText1 = 1;
    let opacityText2 = 0;

    for(let i = 0; i < 10; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage('images/trollge/frame (1).jpg');
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      canvasDraw.wrapText(ctx, text1, {
        x: 10, maxWidth: 610, forceFontSize: 22, forceY: 310, fontColor: 'rgba(255, 255, 255, 1)', quoteAuthor: '',
      });
    }

    for(let i = 1; i <= 44; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage(`images/trollge/frame (${i}).jpg`);
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      if(opacityText1 - 0.045 > 0) {
        canvasDraw.wrapText(ctx, text1, {
          x: 10, maxWidth: 610, forceFontSize: 22, forceY: 310, fontColor: `rgba(255, 255, 255, ${opacityText1})`, quoteAuthor: '',
        });
        opacityText1 -= 0.045;
      }
      else {
        canvasDraw.wrapText(ctx, text2, {
          x: 10, maxWidth: 610, forceFontSize: 22, forceY: 310, fontColor: `rgba(255, 255, 255, ${opacityText2})`, quoteAuthor: '',
        });
        opacityText2 += 0.045;
      }

      encoder.addFrame(ctx);
    }

    for(let i = 0; i < 10; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage('images/trollge/frame (44).jpg');
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      canvasDraw.wrapText(ctx, text2, {
        x: 10, maxWidth: 610, forceFontSize: 22, forceY: 310, fontColor: 'rgba(255, 255, 255, 1)', quoteAuthor: '',
      });
    }

    encoder.finish();
    const buffer = encoder.out.getData();
    const attachment = new MessageAttachment(buffer, 'trollge.gif');
    interaction.editReply({ files: [attachment] });
  },
};