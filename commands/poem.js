module.exports = {
  name: 'poem',
  description: 'Generate poem from your messages',
  usage: '<Rhyme1> <Rhyme2>',
  options: [
    {
      name: 'rhyme1',
      description: 'First rhyme',
      type: 'STRING',
      required: true,
    },
    {
      name: 'rhyme2',
      description: 'Second rhyme',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 1,
  async execute(interaction) {
    const { MessageAttachment } = require('discord.js');
    const { prefix, poemTitles } = require('../bot_config');
    const { getFontSize } = require('../vitek_modules/canvasDraw');
    const rhymingMessages = require('../vitek_db/rhymingMessages');
    const { escapeRegex } = require('../vitek_modules/escapeRegex');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1280, 720);
    const context = canvas.getContext('2d');

    let lyrics_A = [];
    let lyrics_B = [];

    let arg1 = '';
    let arg2 = '';

    const r1 = interaction.options.getString('rhyme1');
    const r2 = interaction.options.getString('rhyme2');

    if(r1 == '-') {
      arg1 = '.';
    }
    else {
      arg1 = `${escapeRegex(r1)}$`;
    }

    if(r2 == '-') {
      arg2 = '.';
    }
    else {
      arg2 = `${escapeRegex(r2)}$`;
    }

    lyrics_A = await rhymingMessages.getMessages(arg1, interaction.guild.id);
    lyrics_B = await rhymingMessages.getMessages(arg2, interaction.guild.id);

    if(!lyrics_A || !lyrics_B) return interaction.reply({ content: `Not enough data to create a poem for these rhymes!\nYou can run: \`${prefix}${this.name} - -\` to generate a poem without rhymes.` });

    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    const lyrics_All = [];

    for(let i = 0; i <= lyrics_A.length - 1; i++) {
      lyrics_All.push(lyrics_A[i]);
      if(i % 2 != 0) {
        lyrics_All.push(lyrics_B[i - 1]);
        lyrics_All.push(lyrics_B[i]);
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
    interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
  },
};