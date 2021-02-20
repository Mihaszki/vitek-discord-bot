module.exports = {
  name: 'pop',
  description: 'Pop cat animation',
  usage: '<Server emoji/@User/URL>',
  cooldown: 3,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(398, 392);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(398, 392);
    ctx.fillStyle = '#000000';
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const loadingMessage = await message.channel.send(':hourglass: Generating...');
      const user_image = await Canvas.loadImage(user_image_url);

      const frame1 = await Canvas.loadImage('images/pop/frame1.png');
      const frame2 = await Canvas.loadImage('images/pop/frame2.png');

      encoder.setDelay(50);
      encoder.start();

      // 1
      ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 2
      ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 3
      ctx.fillRect(165, 133, 144, 136);
      ctx.drawImage(user_image, 165, 133, 144, 136);
      ctx.drawImage(frame2, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 4
      ctx.fillRect(165, 133, 144, 136);
      ctx.drawImage(user_image, 165, 133, 144, 136);
      ctx.drawImage(frame2, 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new Discord.MessageAttachment(buffer, 'pop.gif');
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};