const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ghost')
    .setDescription('Ghost staring mw2 animation')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a short text')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const cleanText = require('../vitek_modules/cleanText');
    const canvas = Canvas.createCanvas(346, 403);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(346, 403);
    const canvasDraw = require('../vitek_modules/canvasDraw');
    ctx.fillStyle = '#ffffff';
    const img = interaction.options.getString('image');
    await interaction.deferReply();

    const msgtext = cleanText.emojis(interaction.options.getString('text').replace(/\s+/g, ' '));
    if (msgtext.length > 500) { return interaction.editReply({ content: 'The text is too long!' }); }

    let y = 244;
    if(msgtext.length < 100) {
      y = 340;
    }
    else if(msgtext.length < 200) {
      y = 300;
    }

    encoder.setQuality(30);
    encoder.setDelay(110);
    encoder.start();

    for (let i = 0; i <= 20; i++) {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const frame = await Canvas.loadImage(`images/ghost/frame_${i.toString().padStart(2, '0')}_delay-0.1s-min.png`);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      canvasDraw.wrapText(ctx, msgtext, {
        x: 15, forceY: y, maxWidth: 331, forceFontSize: 18, shadowColor: '#000000', fontColor: '#FFFFFF', quoteAuthor: null,
      });
      encoder.addFrame(ctx);
    }
    encoder.finish();
    const buffer = encoder.out.getData();
    const attachment = new MessageAttachment(buffer, 'ghost.gif');
    interaction.editReply({ files: [attachment] });
  },
};