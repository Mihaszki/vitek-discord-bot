const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sparde')
    .setDescription('Say something in spurdo sparde language (image version)')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a text')
        .setRequired(true)),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');
    const spurdoTranslator = require('../vitek_modules/spurdoTranslator');
    const canvasDraw = require('../vitek_modules/canvasDraw');
    await interaction.deferReply();

    const background = await Canvas.loadImage('images/spurdo/spurdo.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    canvasDraw.wrapText(context, spurdoTranslator.translate(interaction.options.getString('text')), { x: 375, maxWidth: 900 });

    const attachment = new MessageAttachment(canvas.toBuffer(), 'sparde.png');
    interaction.editReply({ files: [attachment] });
  },
};