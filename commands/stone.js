module.exports = {
  name: 'stone',
  description: 'John Paul II holding a stone',
  usage: '<Server emoji/@User/URL>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const Discord = require('discord.js');
    const canvas = Canvas.createCanvas(460, 613);
    const ctx = canvas.getContext('2d');

    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const user_image = await Canvas.loadImage(user_image_url);
      const background = await Canvas.loadImage('images/stone/stone.png');
      ctx.fillStyle = '#1c171e';
      ctx.fillRect(144, 33, 150, 110);
      ctx.drawImage(user_image, 144, 33, 150, 110);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'stone.png');
      message.channel.send(attachment);
    });
  },
};