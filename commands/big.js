module.exports = {
  name: 'big',
  description: 'Stretch the image to a resolution of 2137x2137',
  usage: '<Server emoji/@User/URL>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(2137, 2137);
    const ctx = canvas.getContext('2d');
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const user_image = await Canvas.loadImage(user_image_url);
      ctx.drawImage(user_image, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'big.png');
      message.channel.send(attachment);
    });
	},
};