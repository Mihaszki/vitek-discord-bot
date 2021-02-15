module.exports = {
  name: 'coelho',
  description: 'Paulo Coelho quotes generator',
  usage: '<text>',
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');
    const { prefix } = require('../bot_config.json');
    const canvasDraw = require('../vitek_modules/canvasDraw');

    const msg = message.cleanContent.slice(prefix.length + this.name.length + 1);
    const background = await Canvas.loadImage('images/coelho/coelho.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    canvasDraw.wrapText(context, `„${msg}”`, {
      x: 475, maxWidth: 800, fontColor: 'white', quoteAuthor: '~ Paulo Coelho'
    });
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'coelho.png');
    message.channel.send(attachment);
	},
};