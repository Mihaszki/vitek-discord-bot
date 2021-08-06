module.exports = {
  name: 'tv',
  description: 'Television news',
  options: [
    {
      name: 'text',
      description: 'Enter a short text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 1,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const cleanText = require('../vitek_modules/cleanText');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1016, 565);
    const context = canvas.getContext('2d');

    const text = cleanText.emojis(interaction.options.getString('text').replace(/\s/g, ' ')).toUpperCase();
    if(text.length > 60) return interaction.reply({ content: 'The text is too long!', ephemeral: true });

    const images = [
      'images/tv/tv1.png',
      'images/tv/tv2.png',
      'images/tv/tv3.png',
      'images/tv/tv4.png',
      'images/tv/tv5.png',
      'images/tv/tv6.png',
    ];

    const background = await Canvas.loadImage(images[Math.floor(Math.random() * images.length)]);

    let y = 431;
    const x = 190;
    const gradient = context.createLinearGradient(0, 0, 0, 170);
    gradient.addColorStop(0, '#fcfcfc');
    gradient.addColorStop(1, '#e6e6e6');
    context.fillStyle = gradient;

    let offset = 5;
    let fontSize = 48;
    do {
      context.font = `${fontSize -= 1}px sans-serif`;
      offset += 1;
    } while (context.measureText(text).width > 760);
    if(fontSize > 30) y += 6;
    y += offset + fontSize;

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.fillText(text, x, y);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'tv.png');
    interaction.reply({ files: [attachment] });
  },
};