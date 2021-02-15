module.exports = {
  name: 'hazmat',
  description: 'Image in the hazmat suit',
  usage: '<Server emoji/@User/URL>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1316, 1316);
    const ctx = canvas.getContext('2d');
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const user_image = await Canvas.loadImage(user_image_url);
      const hazmat = await Canvas.loadImage('images/hazmat/hazmat.png');
      ctx.drawImage(user_image, 401, 273, 734, 734);
      ctx.clearRect(940, 267, 214, 111);
      ctx.clearRect(1056, 376, 214, 111);
      ctx.clearRect(1120, 564, 33, 57);
      ctx.clearRect(1024, 794, 124, 224);
      ctx.drawImage(hazmat, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'hazmat.png');
      message.channel.send(attachment);
    });
  },
};