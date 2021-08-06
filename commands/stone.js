module.exports = {
  name: 'stone',
  description: 'John Paul II holding a stone',
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
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const { MessageAttachment } = require('discord.js');
    const canvas = Canvas.createCanvas(460, 613);
    const ctx = canvas.getContext('2d');

    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      const background = await Canvas.loadImage('images/stone/stone.png');
      ctx.fillStyle = '#1c171e';
      ctx.fillRect(144, 33, 150, 110);
      ctx.drawImage(user_image, 144, 33, 150, 110);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new MessageAttachment(canvas.toBuffer(), 'stone.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};