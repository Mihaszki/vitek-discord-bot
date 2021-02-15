module.exports = {
  name: 'sparde',
  description: 'Say something in spurdo sparde language (image version)',
  usage: '<text>',
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');
    const { prefix } = require('../bot_config.json');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    const canvasDraw = require('../vitek_modules/canvasDraw');

    const msg = message.cleanContent.slice(prefix.length + this.name.length + 1);
    const background = await Canvas.loadImage('images/spurdo/spurdo.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    canvasDraw.wrapText(context, spurdoTranslator.translate(msg), { x: 375, maxWidth: 900 });

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sparde.png');
    message.channel.send(attachment);
  },
};