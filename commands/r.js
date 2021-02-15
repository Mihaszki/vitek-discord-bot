module.exports = {
  name: 'r',
  description: 'Add an image to the letter "R"',
  cooldown: 1,
  guildOnly: true,
  args: true,
  usage: '<Server emoji/@User/URL> <number 1 - 2048>',
  execute(message, args) {
    const Discord = require('discord.js');
    const getImage = require('../vitek_modules/getImage');
    const Canvas = require('canvas');

    let num = 1;
    if(!args[1] || !(/^\d+$/.test(args[1]))) num = 1;
    else if(args[1] > 2048) num = 2048;
    else num = parseInt(args[1]);
    getImage.getImageAndCheckSize(args[0], message, async (user_image_url) => {
      const user_image = await Canvas.loadImage(user_image_url);
      if(num == 1) generateImage(user_image);
      else if(num % 2 == 0) generateTiles(num, user_image);
      else generateTiles(num + 1, user_image);
    });

    async function generateImage(user_image) {
      const canvas = Canvas.createCanvas(648, 667);
      const context = canvas.getContext('2d');
      const background = await Canvas.loadImage('images/r/r.png');
      context.fillStyle = '#fafafa';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(user_image, 0, 0, canvas.width, canvas.height);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'r.png');
      message.channel.send(attachment);
    }

    async function generateTiles(tilesNum, user_image) {
      const tiles = [];
      for(let i = 1; i <= 10; i++) {
        tiles.push(await Canvas.loadImage(`images/r/r_tiles/r_tile${i}.png`));
      }

      const divider = getDivider(tilesNum);
      let tileSize = Math.round(642 / divider);
      if(tileSize < 1) tileSize = 1;
      let canvas;
      let err = true;
      let width = (tilesNum / divider) * tileSize;
      let height = divider * tileSize;

      while(err) {
        try {
          canvas = Canvas.createCanvas(width, height);
          err = false;
        }
        catch {
          tileSize = Math.round(tileSize / 2);
          width = (tilesNum / divider) * tileSize;
          height = divider * tileSize;
          err	= true;
        }
      }

      const loadingMessage = await message.channel.send(`:hourglass: Generating... Tiles: ${tilesNum}`);
      const context = canvas.getContext('2d');
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
      let x = 0;
      let y = 0;

      for(let i = 0; i < height / tileSize; i++) {
        for(let j = 0; j < width / tileSize; j++) {
          context.drawImage(user_image, x, y, tileSize, tileSize);
          context.drawImage(tiles[Math.floor(Math.random() * tiles.length)], x, y, tileSize, tileSize);
          x += tileSize;
        }
        x = 0;
        y += tileSize;
      }
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `r_${tilesNum}.png`);
      message.channel.send(attachment);
      loadingMessage.delete({ timeout: 1000 });
    }

    function median(arr) {
      const mid = Math.floor(arr.length / 2);
      const nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }

    function getDivider(tilesNum) {
      if(tilesNum == 1) return 1;
      let d = 1;
      const nums = [];
      while(d != tilesNum + 1) {
        if(tilesNum % d == 0 && tilesNum != d) nums.push(d);
        d++;
      }
      if(nums.length % 2 == 0) nums.push(d);
      return median(nums);
    }
  },
};