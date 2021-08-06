module.exports = {
  name: 'cmm',
  description: 'Change My Mind',
  options: [
    {
      name: 'text',
      description: 'Enter a short text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 0.5,
  async execute(interaction) {
    const Canvas = require('canvas');
    const { MessageAttachment } = require('discord.js');
    const canvas = Canvas.createCanvas(979, 835);
    const ctx = canvas.getContext('2d');
    const cleanText = require('../vitek_modules/cleanText');

    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    const msgtext = cleanText.emojis(interaction.options.getString('text').replace(/\s+/g, ' '));
    const words = msgtext.split(' ');
    let lineHeight = 45;
    let fontSize = 45;
    let widthOffset = 4;
    let y = 597;

    if(msgtext.length > 261) { return interaction.editReply({ content: 'The text is too long!' }); }
    else if(msgtext.length > 150) {
      lineHeight = 18;
      fontSize = 18;
      widthOffset = 0.3;
      y = 557;
    }
    else if(msgtext.length > 85) {
      lineHeight = 23;
      fontSize = 23;
      widthOffset = 0.5;
      y = 567;
    }
    else if(msgtext.length > 50) {
      lineHeight = 28;
      fontSize = 28;
      widthOffset = 3;
      y = 557;
    }
    else if(msgtext.length > 21) {
      lineHeight = 36;
      fontSize = 36;
      widthOffset = 4;
      y = 587;
    }

    const avatar = await Canvas.loadImage(interaction.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png');
    const background = await Canvas.loadImage('images/changemymind/changemymind.png');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 295, 211, 92, 92);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    const heightOffset = 0;

    const maxWidth = 362;
    let x = 470;
    let line = '';
    let i;
    let test;
    let metrics;
    ctx.font = `${fontSize}px sans-serif`;

    for (i = 0; i < words.length; i++) {
      test = words[i];
      metrics = ctx.measureText(test);
      while (metrics.width > maxWidth) {
        test = test.substring(0, test.length - 1);
        metrics = ctx.measureText(test);
      }
      if (words[i] != test) {
        words.splice(i + 1, 0, words[i].substr(test.length));
        words[i] = test;
      }

      test = line + words[i] + ' ';
      metrics = ctx.measureText(test);

      if (metrics.width > maxWidth && i > 0) {
        ctx.save();
        ctx.translate(x, y + heightOffset);
        ctx.rotate(-0.13 * Math.PI);
        ctx.fillText(line, 0, 0);
        ctx.restore();
        line = words[i] + ' ';
        y += lineHeight;
        x += 10 + widthOffset;
        widthOffset += widthOffset;
      }
      else {
        line = test;
      }
    }

    ctx.save();
    ctx.translate(x, y + heightOffset);
    ctx.rotate(-0.13 * Math.PI);
    ctx.fillText(line, 0, 0);
    ctx.restore();

    const attachment = new MessageAttachment(canvas.toBuffer(), 'changemymind.png');
    interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
  },
};