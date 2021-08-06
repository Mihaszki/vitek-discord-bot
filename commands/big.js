module.exports = {
  name: 'big',
  description: 'Stretch the image to a resolution of 2137x2137',
  options: [
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 1,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const img = interaction.options.getString('image');
    const canvas = Canvas.createCanvas(2137, 2137);
    const ctx = canvas.getContext('2d');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      ctx.drawImage(user_image, 0, 0, canvas.width, canvas.height);
      const attachment = new MessageAttachment(canvas.toBuffer(), 'big.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};