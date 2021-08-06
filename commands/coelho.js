module.exports = {
  name: 'coelho',
  description: 'Paulo Coelho quote generator',
  cooldown: 3,
  options: [
    {
      name: 'text',
      description: 'Enter a quote',
      type: 'STRING',
      required: true,
    },
  ],
  async execute(interaction) {
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    const msg = interaction.options.getString('text');
    const background = await Canvas.loadImage('images/coelho/coelho.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    canvasDraw.wrapText(context, `„${msg}”`, {
      x: 475, maxWidth: 800, fontColor: '#FFFFFF', quoteAuthor: '~ Paulo Coelho',
    });
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'coelho.png');
    interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
  },
};