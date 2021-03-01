module.exports = {
  name: 'ascii',
  description: 'Image to ascii art',
  cooldown: 2,
  args: true,
  guildOnly: true,
  usage: '<Server emoji/@User/URL> <small/medium/large>',
  async execute(message, args) {
    const imgToAscii = require('ascii-img-canvas-nodejs');
    const getImage = require('../vitek_modules/getImage');
    const { trimCanvas } = require('../vitek_modules/canvasDraw');
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(3000, 3000);
    const context = canvas.getContext('2d');

    const fontSize = 10;
    let pic_width = 0;
    let pic_height = 0;
    let msg = '';

    switch (args[1]) {
    case 'small':
      pic_width = 80;
      pic_height = 80;
      msg = '**Size: small.**';
      break;

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

    console.log(pic_width, pic_height);

    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const asciiImgHosted = await imgToAscii(user_image_url, { width: pic_width, height: pic_height });
      const loadingMessage = await message.channel.send(`:hourglass: Generating... | ${msg}`);

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
      const attachment = new Discord.MessageAttachment(trimCanvas(canvas, 3000, 3000).toBuffer(), 'ascii.png');
      await message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};