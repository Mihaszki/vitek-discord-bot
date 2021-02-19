module.exports = {
  name: 'love',
  description: 'Love card',
  usage: '<@User1> <@User2>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const getMention = require('../vitek_modules/getMention');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    const Canvas = require('canvas');
    const { loveQuotes } = require('../bot_config.json');

    if(!args[0] || !args[1]) return message.channel.send('You must tag two users!');

    const member1 = getMention.member(args[0], message);
    const member2 = getMention.member(args[1], message);

    if(!member1 || !member2) return message.channel.send('You must select two users that are on the server!');
    else if(member1 == member2) return message.channel.send('Love with yourself? :wink:');

    const quote = `„${loveQuotes[Math.floor(Math.random() * loveQuotes.length)]}”`;

    const username1 = getMention.username(member1);
    const username2 = getMention.username(member2);

    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('images/love/love.png');
    const avatar1 = await Canvas.loadImage(getMention.avatar(member1));
    const avatar2 = await Canvas.loadImage(getMention.avatar(member2));
    context.fillStyle = '#a10004';
    context.fillRect(background, 0, 0, canvas.width, canvas.height);
    context.drawImage(avatar1, 263, 82, 116, 116);
    context.drawImage(avatar2, 378, 23, 116, 116);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    canvasDraw.wrapText(context, quote, { x: 587, y: 260, maxWidth: 690, fontColor: '#ff00d0', shadowColor: 'black' });

    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1 / 4, 'orange');
    gradient.addColorStop(2 / 4, 'yellow');
    gradient.addColorStop(3 / 4, 'green');
    gradient.addColorStop(1, 'violet');

    context.shadowColor = 'black';
    context.shadowBlur = 5;
    context.lineWidth = 5;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = gradient;

    const messageText = `${username1} + ${username2} = ♥`;
    context.font = canvasDraw.getFontSize(messageText, canvas);
    context.fillText(messageText, canvas.width / 2, canvas.height - 5 - parseInt(context.font));
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'love.png');
    message.channel.send(`${member1} + ${member2} = ❤️`, attachment);
  },
};