module.exports = {
  name: 'monitor',
  description: 'Guy punches computer screen',
  usage: '<Server emoji/@User/URL>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const getImage = require('../vitek_modules/getImage');
    const canvas = Canvas.createCanvas(334, 220);
    const ctx = canvas.getContext('2d');
    const GIFEncoder = require('gif-encoder-2');
    const encoder = new GIFEncoder(334, 220);

    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const loadingMessage = await message.channel.send(':hourglass: Generating...');
      const user_image = await Canvas.loadImage(user_image_url);
      const frames = [];

      for(let i = 1; i <= 34; i++) {
        frames.push(await Canvas.loadImage(`images/monitor/frame${i}.png`));
      }

      ctx.fillStyle = '#ffffff';

      encoder.setDelay(140);
      encoder.start();

      // 1
      ctx.drawImage(frames[0], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 2
      ctx.drawImage(frames[1], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 3
      ctx.drawImage(frames[2], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 4
      ctx.drawImage(frames[3], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 5
      ctx.drawImage(frames[4], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 6
      ctx.drawImage(frames[5], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 7
      ctx.fillRect(62, 60, 71, 94);
      ctx.drawImage(user_image, 62, 60, 71, 94);
      ctx.drawImage(frames[6], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 8
      ctx.fillRect(62, 60, 71, 94);
      ctx.drawImage(user_image, 62, 60, 71, 94);
      ctx.drawImage(frames[7], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 9
      ctx.fillRect(62, 61, 71, 94);
      ctx.drawImage(user_image, 62, 61, 71, 94);
      ctx.drawImage(frames[8], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 10
      ctx.fillRect(62, 61, 71, 94);
      ctx.drawImage(user_image, 62, 61, 71, 94);
      ctx.drawImage(frames[9], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 11
      ctx.fillRect(62, 61, 71, 94);
      ctx.drawImage(user_image, 62, 61, 71, 94);
      ctx.drawImage(frames[10], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 12
      ctx.fillRect(62, 61, 71, 94);
      ctx.drawImage(user_image, 62, 61, 71, 94);
      ctx.drawImage(frames[11], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 13
      ctx.fillRect(62, 63, 71, 94);
      ctx.drawImage(user_image, 62, 63, 71, 94);
      ctx.drawImage(frames[12], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 14
      ctx.fillRect(62, 62, 71, 94);
      ctx.drawImage(user_image, 62, 62, 71, 94);
      ctx.drawImage(frames[13], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 15
      ctx.fillRect(62, 66, 71, 94);
      ctx.drawImage(user_image, 62, 66, 71, 94);
      ctx.drawImage(frames[14], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 16
      ctx.fillRect(62, 67, 71, 94);
      ctx.drawImage(user_image, 62, 67, 71, 94);
      ctx.drawImage(frames[15], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 17
      ctx.fillRect(60, 69, 71, 94);
      ctx.drawImage(user_image, 60, 69, 71, 94);
      ctx.drawImage(frames[16], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 18
      ctx.fillRect(58, 69, 71, 94);
      ctx.drawImage(user_image, 58, 69, 71, 94);
      ctx.drawImage(frames[17], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 19
      ctx.fillRect(57, 69, 71, 94);
      ctx.drawImage(user_image, 57, 69, 71, 94);
      ctx.drawImage(frames[18], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 20
      ctx.fillRect(57, 69, 71, 94);
      ctx.drawImage(user_image, 57, 69, 71, 94);
      ctx.drawImage(frames[19], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 21
      ctx.fillRect(56, 69, 71, 94);
      ctx.drawImage(user_image, 56, 69, 71, 94);
      ctx.drawImage(frames[20], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 22
      ctx.fillRect(55, 70, 71, 94);
      ctx.drawImage(user_image, 55, 70, 71, 94);
      ctx.drawImage(frames[21], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 23
      ctx.fillRect(54, 71, 71, 94);
      ctx.drawImage(user_image, 54, 71, 71, 94);
      ctx.drawImage(frames[22], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 24
      ctx.fillRect(53, 73, 71, 94);
      ctx.drawImage(user_image, 53, 73, 71, 94);
      ctx.drawImage(frames[23], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 25
      ctx.fillRect(53, 74, 71, 94);
      ctx.drawImage(user_image, 53, 74, 71, 94);
      ctx.drawImage(frames[24], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 26
      ctx.fillRect(52, 73, 71, 94);
      ctx.drawImage(user_image, 52, 73, 71, 94);
      ctx.drawImage(frames[25], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 27
      ctx.fillRect(52, 73, 71, 94);
      ctx.drawImage(user_image, 52, 73, 71, 94);
      ctx.drawImage(frames[26], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 28
      ctx.fillRect(52, 73, 71, 94);
      ctx.drawImage(user_image, 52, 73, 71, 94);
      ctx.drawImage(frames[27], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 29
      ctx.fillRect(52, 73, 71, 94);
      ctx.drawImage(user_image, 52, 73, 71, 94);
      ctx.drawImage(frames[28], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 30
      ctx.drawImage(frames[29], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 31
      ctx.drawImage(frames[30], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 32
      ctx.drawImage(frames[31], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 33
      ctx.drawImage(frames[32], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      // 34
      ctx.drawImage(frames[33], 0, 0, canvas.width, canvas.height);
      encoder.addFrame(ctx);

      encoder.finish();
      const buffer = encoder.out.getData();

      const attachment = new Discord.MessageAttachment(buffer, 'monitor.gif');
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    });
  },
};