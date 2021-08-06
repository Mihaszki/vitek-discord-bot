module.exports = {
  name: 'linus',
  description: 'Funny Linus picture',
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
    const canvas = Canvas.createCanvas(595, 333);
    const ctx = canvas.getContext('2d');
    const img = interaction.options.getString('image');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const user_image = await Canvas.loadImage(url);
      const linus = await Canvas.loadImage('images/linus/linus.png');
      ctx.fillStyle = '#000000';
      ctx.fillRect(canvas.width, canvas.height);
      ctx.drawImage(user_image, 148, 114, 414, 162);
      ctx.drawImage(linus, 0, 0, canvas.width, canvas.height);
      const attachment = new MessageAttachment(canvas.toBuffer(), 'linus.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};