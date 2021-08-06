module.exports = {
  name: 'friendship',
  description: 'Friendship ended with X, now Y is my best friend',
  cooldown: 1,
  options: [
    {
      name: 'word1',
      description: 'Enter a first word',
      type: 'STRING',
      required: true,
    },
    {
      name: 'word2',
      description: 'Enter a second word',
      type: 'STRING',
      required: true,
    },
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(500, 372);
    const context = canvas.getContext('2d');
    const { drawTextInBox } = require('../vitek_modules/canvasDraw');

    const img = interaction.options.getString('image');
    const word1 = interaction.options.getString('word1').trim().split(' ')[0];
    const word2 = interaction.options.getString('word2').trim().split(' ')[0];

    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const background = await Canvas.loadImage('images/friendship/friendship.png');
      const foreground = await Canvas.loadImage('images/friendship/x.png');
      const user_image = await Canvas.loadImage(url);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.drawImage(user_image, 0, 207, 106, 165);
      context.drawImage(user_image, 361, 225, 139, 147);
      context.drawImage(foreground, 0, 0, canvas.width, canvas.height);

      context.fillStyle = '#a10004';

      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#4da927');
      gradient.addColorStop(1 / 4, '#818419');
      gradient.addColorStop(2 / 4, '#4eb541');
      gradient.addColorStop(3 / 4, '#9f6b15');
      gradient.addColorStop(1, '#5ea026');

      context.shadowColor = '#522f64';
      context.shadowBlur = 1;
      context.lineWidth = 5;
      context.font = '30px sans-serif';
      context.fillStyle = gradient;

      drawTextInBox(context, word1, 'sans-serif', 328, -5, 160, 51);

      const gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient2.addColorStop(0, '#bd5516');
      gradient2.addColorStop(1 / 4, '#bd5516');
      gradient2.addColorStop(2 / 4, '#bd5516');
      gradient2.addColorStop(3 / 4, '#bd5516');
      gradient2.addColorStop(1, '#bd5516');
      context.fillStyle = gradient2;

      drawTextInBox(context, word2, 'sans-serif', 195, 85, 110, 50);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'friendship.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};