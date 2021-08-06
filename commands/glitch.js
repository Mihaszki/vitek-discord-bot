module.exports = {
  name: 'glitch',
  description: 'Glitch animation',
  options: [
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 2,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(256, 256);
    ctx.textAlign = 'center';
    ctx.font = '200px sans-serif';
    ctx.textBaseline = 'middle';
    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      const noise1 = await Canvas.loadImage('images/glitch/noise1.png');
      const noise2 = await Canvas.loadImage('images/glitch/noise2.png');

      const imgSize = {
        width: 256,
        height: 256,
      };

      const coords = {
        x: canvas.width / 2 - (imgSize.width / 2),
        y: canvas.height / 2 - (imgSize.height / 2),
      };

      const caFrame = (padding, padding2, show_normal = true, color1 = 'rgba(255, 0, 251, 0.5)', color2 = 'rgba(0, 255, 30, 0.5)') => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color1;
        ctx.drawImage(user_image, coords.x + padding, coords.y + padding, imgSize.width, imgSize.height);
        ctx.fillRect(coords.x + padding, coords.y + padding, imgSize.width, imgSize.height);

        ctx.fillStyle = color2;
        ctx.drawImage(user_image, coords.x - padding, coords.y - padding, imgSize.width, imgSize.height);
        ctx.fillRect(coords.x - padding, coords.y - padding, imgSize.width, imgSize.height);

        if(show_normal) ctx.drawImage(user_image, coords.x + padding2, coords.y - padding2, imgSize.width, imgSize.height);

        ctx.drawImage(noise2, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(noise1, 0, 0, canvas.width, canvas.height);

        encoder.addFrame(ctx);
      };

      encoder.setDelay(100);
      encoder.start();

      for(let i = 1; i < 6; i++) {
        caFrame(i, -i * 1.5);
      }
      for(let i = 1; i < 6; i *= 2) {
        caFrame(-i, i * 1.5);
      }
      caFrame(-36, 0, false);
      caFrame(-36, 0, false);
      for(let i = 1; i < 6; i++) {
        caFrame(i, -i * -i);
      }
      for(let i = 1; i < 6; i *= 2) {
        caFrame(-i, i * i);
      }
      caFrame(38, 0, false, 'rgba(0, 255, 30, 0.5)', 'rgba(255, 0, 251, 0.5)');
      caFrame(38, 0, false, 'rgba(0, 255, 30, 0.5)', 'rgba(255, 0, 251, 0.5)');

      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new MessageAttachment(buffer, 'glitch.gif');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};