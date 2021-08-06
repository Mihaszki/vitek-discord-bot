module.exports = {
  name: 'nyan',
  description: 'Nyan cat animation',
  options: [
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 3,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(476, 280);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(476, 280);
    ctx.fillStyle = '#013368';
    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);

      const frames = [];
      for(let i = 1; i <= 12; i++) {
        frames.push(await Canvas.loadImage(`images/nyan/frame${i}-min.png`));
      }

      encoder.setDelay(60);
      encoder.start();

      // 1
      ctx.fillRect(185, 87, 88, 88);
      ctx.drawImage(user_image, 185, 87, 88, 88);
      ctx.drawImage(frames[0], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 2
      ctx.fillRect(185, 87, 88, 88);
      ctx.drawImage(user_image, 185, 87, 88, 88);
      ctx.drawImage(frames[1], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 3
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[2], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 4
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[3], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 5
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[4], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 6
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[5], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 7
      ctx.fillRect(185, 87, 88, 88);
      ctx.drawImage(user_image, 185, 87, 88, 88);
      ctx.drawImage(frames[6], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 8
      ctx.fillRect(185, 87, 88, 88);
      ctx.drawImage(user_image, 185, 87, 88, 88);
      ctx.drawImage(frames[7], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 9
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[8], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 10
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[9], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 11
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[10], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 12
      ctx.fillRect(185, 91, 88, 88);
      ctx.drawImage(user_image, 185, 91, 88, 88);
      ctx.drawImage(frames[11], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new MessageAttachment(buffer, 'nyan.gif');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};