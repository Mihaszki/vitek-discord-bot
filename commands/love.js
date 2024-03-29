const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('love')
    .setDescription('Love card')
    .addUserOption(option =>
      option.setName('user1')
        .setDescription('First user')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user2')
        .setDescription('Second user')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const getMention = require('../vitek_modules/getMention');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    const Canvas = require('canvas');
    const { loveQuotes } = require('../bot_config');

    await interaction.deferReply();

    const member1 = interaction.options.getMember('user1');
    const member2 = interaction.options.getMember('user2');

    if (!member1 || !member2) return interaction.editReply({ content: 'You must enter a user who is on the server!' });
    else if (member1 == member2) return interaction.editReply({ content: 'Love with yourself? :wink:' });

    const quote = `„${loveQuotes[Math.floor(Math.random() * loveQuotes.length)]}”`;

    const username1 = getMention.username(member1);
    const username2 = getMention.username(member2);

    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('images/love/love.png');
    const avatar1 = await Canvas.loadImage(getMention.avatar(member1.user));
    const avatar2 = await Canvas.loadImage(getMention.avatar(member2.user));
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
    const attachment = new MessageAttachment(canvas.toBuffer(), 'love.png');
    interaction.editReply({ content: `${member1} + ${member2} = ❤️`, files: [attachment] });
  },
};