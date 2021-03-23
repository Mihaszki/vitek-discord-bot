module.exports = {
  name: 'catjam',
  description: 'catJAM animation',
  usage: '<Server emoji/@User/URL>',
  cooldown: 5,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(350, 190);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(350, 190);
    ctx.fillStyle = '#000000';
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const loadingMessage = await message.channel.send(':hourglass: Generating...');
      const user_image = await Canvas.loadImage(user_image_url);

      encoder.setQuality(30);
      encoder.setDelay(40);
      encoder.start();

      for(let i = 1; i <= 151; i++) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const img = await Canvas.loadImage(`images/catjam/frame (${i}).png`);
        ctx.drawImage(user_image, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 280, 190);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new Discord.MessageAttachment(buffer, 'catjam.gif');
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};