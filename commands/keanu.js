module.exports = {
  name: 'keanu',
  description: 'Johnny Silverhand with your image and quote',
  cooldown: 0.1,
  args: true,
  guildOnly: true,
  usage: '<Server emoji/@User/URL> <Upper text\\Bottom text>',
  async execute(message, args) {
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const Discord = require('discord.js');

    const applyText = (canvas, text, startFontSize) => {
      const ctx = canvas.getContext('2d');
      let fontSize = startFontSize;
      do {
        fontSize -= 5;
        ctx.font = `${fontSize}px sans-serif`;
      } while (ctx.measureText(text).width > canvas.width - 50 || fontSize <= 10);
      return ctx.font;
    };

    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const canvas = Canvas.createCanvas(1495, 841);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#000000';

      args.shift();
      const text = args.join(' ').split('\\');
      if(text.length < 1 || !text[0] || !text[1]) {
        return message.channel.send('Text must be in this format:\n``Upper text\\Bottom text``');
      }

      const user_image = await Canvas.loadImage(user_image_url);
      const bg = await Canvas.loadImage('images/keanu/keanu.png');
      const x = 657;
      const y = 143;
      const w = 239;
      const h = 381;
      const cx = x + 0.5 * w;
      const cy = y + 0.5 * h;
      const deg = Math.PI / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(20 * deg);
      ctx.translate(-cx, -cy);
      ctx.drawImage(user_image, x, y, w, h);
      ctx.restore();

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = applyText(canvas, text[0], 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(text[0], (canvas.width / 2) - (ctx.measureText(text[0]).width / 2), 65);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text[0], (canvas.width / 2) - (ctx.measureText(text[0]).width / 2), 65);

      ctx.font = applyText(canvas, text[1], 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(text[1], (canvas.width / 2) - (ctx.measureText(text[1]).width / 2), 776);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text[1], (canvas.width / 2) - (ctx.measureText(text[1]).width / 2), 776);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'keanu.png');

      message.channel.send(attachment);
    });
  },
};