const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dallemini')
    .setDescription('DALL-E mini by craiyon.com | AI model generating images from any prompt!')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Enter a prompt')
        .setRequired(true)),
  async execute(interaction) {
    const axios = require('axios');
    const { MessageAttachment } = require('discord.js');
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(760, 802);
    const ctx = canvas.getContext('2d');
    const text = interaction.options.getString('prompt');
    ctx.fillStyle = '#000000';
    ctx.font = '15px sans-serif';
    await interaction.deferReply();

    if(text.length > 1000) {
      return interaction.editReply({ content: 'The prompt is too long!' });
    }

    const data = {
      prompt: text,
    };

    axios.post('https://backend.craiyon.com/generate', data)
      .then(async (res) => {
        console.log();
        if (res.status !== 200) {
          return interaction.editReply({ content: 'Status code: ' + res.status });
        }
        else if (res.data.images.length !== 9) {
          return interaction.editReply({ content: 'Not enough images. Try a different prompt.' });
        }

        const canvasImages = [];
        for(const img of res.data.images) {
          const c = await Canvas.loadImage('data:image/jpeg;base64,' + img)
          canvasImages.push(c);
        }

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImages[0], 10, 10, 240, 240);
        ctx.drawImage(canvasImages[1], 260, 10, 240, 240);
        ctx.drawImage(canvasImages[2], 510, 10, 240, 240);

        ctx.drawImage(canvasImages[3], 10, 260, 240, 240);
        ctx.drawImage(canvasImages[4], 260, 260, 240, 240);
        ctx.drawImage(canvasImages[5], 510, 260, 240, 240);

        ctx.drawImage(canvasImages[6], 10, 510, 240, 240);
        ctx.drawImage(canvasImages[7], 260, 510, 240, 240);
        ctx.drawImage(canvasImages[8], 510, 510, 240, 240);

        ctx.fillStyle = '#ffffff';
        const line1 = 'DALL·E mini by craiyon.com';
        ctx.fillText(line1, (canvas.width / 2) - (ctx.measureText(line1).width / 2), 790);
        let line2 = 'Prompt: ' + text;
        if (line2.length > 50) {
          line2 = line2.slice(0, 50) + '...';
        }
        ctx.fillText(line2, (canvas.width / 2) - (ctx.measureText(line2).width / 2), 770);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');
        interaction.editReply({ files: [attachment] });
      }).catch(async (err) => {
        console.log(err);
        let errText = '';
        try {
          errText = JSON.stringify(err);
        } catch {
          errText = 'Unknown Error';
        }
        let msgText = 'There was an error. ';
        if (errText.length > 1500) {
          errText = errText.slice(0, 1500) + '...';
        }

        return interaction.editReply({ content: msgText + '```' + errText + '```' });
      });
  },
};