module.exports = {
  name: 'ascii',
  description: 'Image to ascii art',
  options: [
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
    {
      name: 'size',
      description: 'Size of the ascii art',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'small',
          value: 'small',
        },
        {
          name: 'medium',
          value: 'medium',
        },
        {
          name: 'large',
          value: 'large',
        },
      ],
    },
  ],
  cooldown: 2,
  async execute(interaction) {
    const imgToAscii = require('ascii-img-canvas-nodejs');
    const getImage = require('../vitek_modules/getImage');
    const { trimCanvas } = require('../vitek_modules/canvasDraw');
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(3000, 3000);
    const context = canvas.getContext('2d');

    const fontSize = 10;
    let pic_width = 0;
    let pic_height = 0;
    let msg = '';

    const picSize = interaction.options.getString('size');
    switch (picSize) {
    case 'medium':
      pic_width = 120;
      pic_height = 120;
      msg = '**Size: medium.**';
      break;

    case 'large':
      pic_width = 220;
      pic_height = 220;
      msg = '**Size: large.**';
      break;

    default:
      pic_width = 80;
      pic_height = 80;
      msg = '**Size: small.**';
      break;
    }

    const img = interaction.options.getString('image');
    await interaction.reply({ content: `Generating... :hourglass_flowing_sand: | ${msg}` });

    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const asciiImgHosted = await imgToAscii(url, { width: pic_width, height: pic_height });

      const lineHeight = 11;
      const lineWidth = 6;
      let x = 5;
      let y = lineHeight - 3;
      context.font = fontSize + 'px sans-serif';
      context.quality = 'best';
      context.patternQuality = 'best';

      const ascii = asciiImgHosted.split('\n');
      for(let i = 0; i < ascii.length; i++) {
        for(let j = 0; j < ascii[i].length; j++) {
          context.fillStyle = '#000000';
          context.fillRect(x, y - 8, 10, 16);
          context.fillStyle = '#FFFFFF';
          context.fillText(ascii[i][j], x, y);
          x += lineWidth;
        }
        y += lineHeight;
        x = 5;
      }
      const attachment = new MessageAttachment(trimCanvas(canvas, 3000, 3000).toBuffer(), 'ascii.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};