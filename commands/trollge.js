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
        .setRequired(true))
    .addStringOption(option =>
      option.setName('direction')
        .setDescription('Animation direction')
        .setRequired(false)
        .addChoice('sad->happy', 'sad->happy')
        .addChoice('happy->sad', 'happy->sad')),
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
    let direction = interaction.options.getString('direction');
    if(!direction) {direction = 'sad->happy';}

    if(text1.length > 148) {
      return interaction.editReply({ content: 'The first text is too long!' });
    }
    else if(text2.length > 148) {
      return interaction.editReply({ content: 'The second text is too long!' });
    }

    encoder.setQuality(30);
    encoder.setDelay(100);
    encoder.start();

    let firstFrame = 1;
    let lastFrame = 44;

    if(direction == 'sad->happy') {
      firstFrame = 1;
      lastFrame = 44;
    }
    else if(direction == 'happy->sad') {
      firstFrame = 44;
      lastFrame = 1;
    }

    let animate = true;
    const increment = (firstFrame < lastFrame) ? 1 : -1;
    let x = firstFrame;
    let opacityText1 = 1;
    let opacityText2 = 0;

    for(let i = 0; i < 10; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage(`images/trollge/frame (${increment == 1 ? firstFrame : lastFrame}).jpg`);
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      canvasDraw.wrapText(ctx, text1, {
        x: 10, maxWidth: 610, forceFontSize: 22, forceY: 310, fontColor: 'rgba(255, 255, 255, 1)', quoteAuthor: '',
      });
    }

    while(animate) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage(`images/trollge/frame (${x}).jpg`);
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

      x += increment;
      if((increment == 1 && x > lastFrame) || (increment == -1 && x < lastFrame)) {animate = false;}
    }

    for(let i = 0; i < 10; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frameImg = await Canvas.loadImage(`images/trollge/frame (${increment == 1 ? lastFrame : firstFrame}).jpg`);
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