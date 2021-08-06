module.exports = {
  name: 'keanu',
  description: 'Johnny Silverhand with your image and quote',
  cooldown: 0.1,
  options: [
    {
      name: 'line1',
      description: 'Enter a top line of text',
      type: 'STRING',
      required: true,
    },
    {
      name: 'line2',
      description: 'Enter a bottom line of text',
      type: 'STRING',
      required: true,
    },
    {
      name: 'image',
      description: '@User or Server emoji or URL',
      type: 'STRING',
      required: true,
    },
  ],
  async execute(interaction) {
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');
    const { MessageAttachment } = require('discord.js');

    await interaction.reply({ content: 'Generating... :hourglass_flowing_sand:' });

    const applyText = (canvas, text, startFontSize) => {
      const ctx = canvas.getContext('2d');
      let fontSize = startFontSize;
      do {
        fontSize -= 5;
        ctx.font = `${fontSize}px sans-serif`;
      } while (ctx.measureText(text).width > canvas.width - 50 || fontSize <= 10);
      return ctx.font;
    };

    const line1 = interaction.options.getString('line1');
    const line2 = interaction.options.getString('line2');
    const img = interaction.options.getString('image');
    getImage.getImageAndCheckSize(img, interaction, async ({ error, url }) => {
      if(error) {
        return interaction.editReply({ content: error });
      }
      const canvas = Canvas.createCanvas(1495, 841);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#000000';

      const user_image = await Canvas.loadImage(url);
      const bg = await Canvas.loadImage('images/keanu/keanu.png');
      const x = 657;
      const y = 143;
      const w = 239;
      const h = 381;
      const cx = x + 0.5 * w;
      const cy = y + 0.5 * h;
      const deg = Math.PI / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(20 * deg);
      ctx.translate(-cx, -cy);
      ctx.drawImage(user_image, x, y, w, h);
      ctx.restore();

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = applyText(canvas, line1, 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(line1, (canvas.width / 2) - (ctx.measureText(line1).width / 2), 65);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line1, (canvas.width / 2) - (ctx.measureText(line1).width / 2), 65);

      ctx.font = applyText(canvas, line2, 65);
      ctx.fillStyle = '#000000';
      ctx.fillText(line2, (canvas.width / 2) - (ctx.measureText(line2).width / 2), 776);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line2, (canvas.width / 2) - (ctx.measureText(line2).width / 2), 776);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'keanu.png');
      interaction.editReply({ content: 'Done! :hourglass:', files: [attachment] });
    });
  },
};