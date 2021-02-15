module.exports = {
  name: 'linus',
  description: 'Funny Linus picture',
  usage: '<Server emoji/@User/URL>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(595, 333);
    const ctx = canvas.getContext('2d');
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const user_image = await Canvas.loadImage(user_image_url);
      const linus = await Canvas.loadImage('images/linus/linus.png');
      ctx.fillStyle = '#000000';
      ctx.fillRect(canvas.width, canvas.height);
      ctx.drawImage(user_image, 148, 114, 414, 162);
      ctx.drawImage(linus, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'linus.png');
      message.channel.send(attachment);
    });
  },
};