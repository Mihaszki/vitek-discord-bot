module.exports = {
  name: 'sparde',
  description: 'Say something in spurdo sparde language (image version)',
  options: [
    {
      name: 'text',
      description: 'Enter a text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 3,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    const background = await Canvas.loadImage('images/spurdo/spurdo.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    canvasDraw.wrapText(context, spurdoTranslator.translate(interaction.options.getString('text')), { x: 375, maxWidth: 900 });

    const attachment = new MessageAttachment(canvas.toBuffer(), 'sparde.png');
    interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
  },
};