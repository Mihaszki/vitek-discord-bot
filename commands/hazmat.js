module.exports = {
  name: 'hazmat',
  description: 'Image in the hazmat suit',
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
    const canvas = Canvas.createCanvas(1316, 1316);
    const ctx = canvas.getContext('2d');
    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      const hazmat = await Canvas.loadImage('images/hazmat/hazmat.png');
      ctx.drawImage(user_image, 401, 273, 734, 734);
      ctx.clearRect(940, 267, 214, 111);
      ctx.clearRect(1056, 376, 214, 111);
      ctx.clearRect(1120, 564, 33, 57);
      ctx.clearRect(1024, 794, 124, 224);
      ctx.drawImage(hazmat, 0, 0, canvas.width, canvas.height);
      const attachment = new MessageAttachment(canvas.toBuffer(), 'hazmat.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};