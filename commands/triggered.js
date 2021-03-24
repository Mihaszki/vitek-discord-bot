module.exports = {
  name: 'triggered',
  description: 'Triggered animation',
  usage: '<Server emoji/@User/URL>',
  cooldown: 3,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(500, 600);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(500, 600);
    ctx.fillStyle = '#000000';
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const loadingMessage = await message.channel.send(':hourglass: Generating...');
      const user_image = await Canvas.loadImage(user_image_url);
      const triggered = await Canvas.loadImage('images/triggered/triggered.png');
      const overlay = await Canvas.loadImage('images/triggered/overlay.png');

      encoder.setDelay(30);
      encoder.start();

      const rand = (min = 0, max = 20) => Math.random() * (max - min) + min;
      const triggeredHeight = 100;
      const add = 30;

      for(let i = 0; i < 15; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(user_image, rand() - 15, rand() - 15, add + canvas.width, add + canvas.height - triggeredHeight / 1.5);
        ctx.drawImage(triggered, rand() - 15, canvas.height - triggeredHeight - rand() - 15, add + canvas.width, add + triggeredHeight);
        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
      }

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new Discord.MessageAttachment(buffer, 'triggered.gif');
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};