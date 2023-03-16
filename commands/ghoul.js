const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ghoul')
    .setDescription('xddinside')
    .addStringOption(option =>
      option.setName('image')
        .setDescription('@User or Server emoji or URL')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(640, 360);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(640, 360);
    ctx.fillStyle = '#fbf9fd';
    const img = interaction.options.getString('image');
    await interaction.deferReply();
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if (error) {
        return interaction.editReply({ content: error });
      }
      const userImage = await Canvas.loadImage(url);

      encoder.setQuality(30);
      encoder.setDelay(40);
      encoder.start();

      for (let i = 1; i <= 59; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const frame = await Canvas.loadImage(`images/ghoul/frame_${i.toString().padStart(2, '0')}_delay-0.04s.png`);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
      }

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let frame = await Canvas.loadImage(`images/ghoul/frame_60_delay-0.04s.png`);
      ctx.drawImage(userImage, 73, 285, 572, 325);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);


      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_61_delay-0.04s.png`);
      ctx.drawImage(userImage, 43, 528, 572, 325);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_62_delay-0.04s.png`);
      ctx.drawImage(userImage, 44, 186, 572, 325);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);
 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_63_delay-0.04s.png`);
      ctx.drawImage(userImage, 43, 68, 572, 295);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_64_delay-0.04s.png`);
      ctx.drawImage(userImage, 48, 71, 572, 295);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_65_delay-0.04s.png`);
      ctx.drawImage(userImage, 91, 30, 465, 335);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_66_delay-0.04s.png`);
      ctx.drawImage(userImage, 53, 62, 540, 303);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_67_delay-0.04s.png`);
      ctx.drawImage(userImage, 53, 45, 542, 317);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_68_delay-0.04s.png`);
      ctx.drawImage(userImage, 33, 58, 576, 302);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_69_delay-0.04s.png`);
      ctx.drawImage(userImage, 59, 75, 519, 288);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_70_delay-0.04s.png`);
      ctx.drawImage(userImage, 77, 53, 506, 309);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_71_delay-0.04s.png`);
      ctx.drawImage(userImage, 62, 54, 506, 309);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_72_delay-0.04s.png`);
      ctx.drawImage(userImage, 51, 54, 506, 309);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_73_delay-0.04s.png`);
      ctx.drawImage(userImage, 41, 67, 555, 297);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_74_delay-0.04s.png`);
      ctx.drawImage(userImage, 54, 58, 495, 305);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_75_delay-0.04s.png`);
      ctx.drawImage(userImage, 52, 59, 495, 305);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_76_delay-0.04s.png`);
      ctx.drawImage(userImage, 54, 53, 495, 305);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_77_delay-0.04s.png`);
      ctx.drawImage(userImage, 63, 48, 536, 312);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_78_delay-0.04s.png`);
      ctx.drawImage(userImage, 52, 47, 536, 312);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_79_delay-0.04s.png`);
      ctx.drawImage(userImage, 71, 42, 515, 324);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);


      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_80_delay-0.04s.png`);
      ctx.drawImage(userImage, 50, 45, 515, 324);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_81_delay-0.04s.png`);
      ctx.drawImage(userImage, 45, 44, 515, 324);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frame = await Canvas.loadImage(`images/ghoul/frame_82_delay-0.04s.png`);
      ctx.drawImage(userImage, 27, 38, 515, 324);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      encoder.addFrame(ctx);

      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new MessageAttachment(buffer, 'ghoul.gif');
      interaction.editReply({ files: [attachment] });
    });
  },
};