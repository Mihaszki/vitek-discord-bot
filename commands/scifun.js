module.exports = {
  name: 'scifun',
  description: 'Scifun animation',
  usage: '<Server emoji/@User/URL>',
  cooldown: 5,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(290, 280);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(290, 280);
    ctx.fillStyle = '#e26861';
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const loadingMessage = await message.channel.send(':hourglass: Generating...');
      const user_image = await Canvas.loadImage(user_image_url);

      const x = 77;
      const y = 153;
      let rotation = 0;
      const w = 79;
      const h = 82;
      const cx = x + 0.5 * w;
      const cy = y + 0.5 * h;
      const deg = Math.PI / 180;

      encoder.setQuality(30);
      encoder.setDelay(40);
      encoder.start();

      for(let i = 1; i <= 167; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = await Canvas.loadImage(`images/scifun/frame(${i}).png`);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation * deg);
        ctx.translate(-cx, -cy);
        rotation = rotation + (i / 2);
        ctx.drawImage(user_image, x, y, w, h);
        ctx.restore();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = encoder.out.getData();
      const attachment = new Discord.MessageAttachment(buffer, 'scifun.gif');
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};