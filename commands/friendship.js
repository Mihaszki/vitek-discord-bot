module.exports = {
  name: 'friendship',
  description: 'Friendship ended with X, now Y is my best friend',
  usage: '<Word1> <Word2> <Server emoji/@User/URL>',
  cooldown: 1,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const Discord = require('discord.js');
    const { prefix } = require('../bot_config.json');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(500, 372);
    const context = canvas.getContext('2d');
    const { drawTextInBox } = require('../vitek_modules/canvasDraw');

    if(!args[0] || !args[1] || !args[2]) return message.channel.send(`You must give all three arguments!\n\`${prefix}${this.name} ${this.usage}\``);

    getImage.getImageAndCheckSize(args[2], message, async (user_image_url) => {
      const background = await Canvas.loadImage('images/friendship/friendship.png');
      const foreground = await Canvas.loadImage('images/friendship/x.png');
      const user_image = await Canvas.loadImage(user_image_url);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.drawImage(user_image, 0, 207, 106, 165);
      context.drawImage(user_image, 361, 225, 139, 147);
      context.drawImage(foreground, 0, 0, canvas.width, canvas.height);

      context.fillStyle = '#a10004';

      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#4da927');
      gradient.addColorStop(1 / 4, '#818419');
      gradient.addColorStop(2 / 4, '#4eb541');
      gradient.addColorStop(3 / 4, '#9f6b15');
      gradient.addColorStop(1, '#5ea026');

      context.shadowColor = '#522f64';
      context.shadowBlur = 1;
      context.lineWidth = 5;
      context.font = '30px Arial Black';
      context.fillStyle = gradient;

      drawTextInBox(context, args[0], 'sans-serif', 333, -10, 166, 51);

      const gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient2.addColorStop(0, '#bd5516');
      gradient2.addColorStop(1 / 4, '#bd5516');
      gradient2.addColorStop(2 / 4, '#bd5516');
      gradient2.addColorStop(3 / 4, '#bd5516');
      gradient2.addColorStop(1, '#bd5516');
      context.fillStyle = gradient2;

      drawTextInBox(context, args[1], 'sans-serif', 195, 85, 104, 48);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'friendship.png');
      message.channel.send(attachment);
    });
  },
};