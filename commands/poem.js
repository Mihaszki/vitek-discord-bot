const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poem')
    .setDescription('Generate poem from your messages')
    .addStringOption(option =>
      option.setName('rhyme1')
        .setDescription('First rhyme'))
    .addStringOption(option =>
      option.setName('rhyme2')
        .setDescription('Second rhyme'))
    .addStringOption(option =>
      option.setName('search-type')
        .setDescription('Search type')
        .addChoice('line-end', 'line-end')
        .addChoice('global', 'global')),
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const { poemTitles } = require('../bot_config');
    const { getFontSize } = require('../vitek_modules/canvasDraw');
    const rhymingMessages = require('../vitek_db/rhymingMessages');
    const { escapeRegex } = require('../vitek_modules/escapeRegex');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');

    await interaction.deferReply();
    let lyrics_A = [];
    let lyrics_B = [];

    let arg1 = '';
    let arg2 = '';

    const r1 = interaction.options.getString('rhyme1');
    const r2 = interaction.options.getString('rhyme2');
    const searchType = interaction.options.getString('search-type') == 'global' ? 'global' : 'line-end';

    const sampleRhymes = ['fa', 'ba', 'ana', 'aba', 'ara', 'aha', 'asa', 'cia', 'cie', 'ble', 'ha', 'wa', 'na', 'ma', 'pa', 'da', 'de', 'dy', 'ka', 'ki', 'xa', 'wy', 'ni', 'ec', 'ac', 'we', 'wu', 'ne', 'er', 'pe', 'al', 'ga'];

    if(!r1) {
      arg1 = `${sampleRhymes[Math.floor(Math.random() * sampleRhymes.length)]}$`;
    }
    else {
      arg1 = escapeRegex(r1);
      if(searchType == 'line-end') {
        arg1 += '$';
      }
    }

    if(!r2) {
      arg2 = `${sampleRhymes[Math.floor(Math.random() * sampleRhymes.length)]}$`;
    }
    else {
      arg2 = escapeRegex(r2);
      if(searchType == 'line-end') {
        arg2 += '$';
      }
    }

    lyrics_A = await rhymingMessages.getMessages(arg1, interaction.guild.id);
    lyrics_B = await rhymingMessages.getMessages(arg2, interaction.guild.id);

    if(!lyrics_A) {
      lyrics_A = await rhymingMessages.getMessages('.', interaction.guild.id);
    }

    if(!lyrics_B) {
      lyrics_B = await rhymingMessages.getMessages('.', interaction.guild.id);
    }

    const lyrics_All = [];

    for(let i = 0; i <= lyrics_A.length - 1; i++) {
      lyrics_All.push(lyrics_A[i]);
      if(i % 2 != 0) {
        lyrics_All.push(lyrics_B[i - 1]);
        lyrics_All.push(lyrics_B[i]);
      }
    }

    for(let i = 0; i <= lyrics_All.length - 1; i++) {
      if(lyrics_All[i].length > 70) {
        lyrics_All[i] = lyrics_All[i].slice(lyrics_All[i].length - 70);
      }
    }

    const randWord = lyrics_All[Math.floor(Math.random() * lyrics_All.length)].split(' ')[0].replace(/,/g, ' ');
    const title = `„${poemTitles[Math.floor(Math.random() * poemTitles.length)].replace('@', randWord)}”`.toUpperCase().replace(/\\n/g, '').replace(/\n/g, '');

    const background = await Canvas.loadImage('https://picsum.photos/1280/720/?blur=2');
    const foreground = await Canvas.loadImage('images/poem/poem.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.drawImage(foreground, 0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 3;
    context.shadowColor = '#000000';
    const lineHeight = 50;
    let y = 130;

    for(let i = 0; i < lyrics_All.length; i++) {
      context.font = getFontSize(lyrics_All[i], canvas, 50, 45, 5);
      context.fillText(lyrics_All[i], (canvas.width / 2) - (context.measureText(lyrics_All[i]).width / 2), y);
      y += lineHeight;
    }

    y += lineHeight * 2;

    context.font = getFontSize(title, canvas, 50, 40, 5);
    context.fillText(title, (canvas.width / 2) - (context.measureText(title).width / 2), 650);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'poem.png');
    interaction.editReply({ files: [attachment] });
  },
};