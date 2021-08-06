module.exports = {
  name: 'catjam',
  description: 'catJAM animation',
  options: [
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 5,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(350, 190);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(350, 190);
    ctx.fillStyle = '#000000';
    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);

      encoder.setQuality(30);
      encoder.setDelay(40);
      encoder.start();

      for(let i = 1; i <= 151; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const frame = await Canvas.loadImage(`images/catjam/frame (${i}).png`);
        ctx.drawImage(user_image, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0, 280, 190);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new MessageAttachment(buffer, 'catjam.gif');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};