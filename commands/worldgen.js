module.exports = {
  name: 'worldgen',
  description: 'Generate a simple 2D world',
  usage: '<seed>',
  cooldown: 2,
  args: true,
  guildOnly: true,
  async execute(message) {
    const Discord = require('discord.js');
    const cleanText = require('../vitek_modules/cleanText');
    const Canvas = require('canvas');
    const SimplexNoise = require('simplex-noise');
    const worldSize = 3072;
    const canvas = Canvas.createCanvas(worldSize, worldSize);
    const ctx = canvas.getContext('2d');
    const treeCanvas = Canvas.createCanvas(worldSize, worldSize);
    const treeCtx = canvas.getContext('2d');
    const { prefix } = require('../bot_config');

    const seed = cleanText.emojis(message.cleanContent.slice(prefix.length + this.name.length + 1));

    const grass = await Canvas.loadImage('images/worldgen/grass.png');
    const snow = await Canvas.loadImage('images/worldgen/snow.png');
    const water = await Canvas.loadImage('images/worldgen/water.png');
    const tree_green = await Canvas.loadImage('images/worldgen/tree_grass.png');
    const tree_snow = await Canvas.loadImage('images/worldgen/tree_snow.png');
    let img = null;
    let treeImg = null;
    let lastValue = 0;

    const simplex = new SimplexNoise(seed);
    const tileSize = 32;

    const weight = {
      snow: 50,
      grass: -10,
    };

    const data = [];
    let tmpArray = [];
    const tiles = worldSize / tileSize;
    for (let y = 0; y < tiles; y += 1) {
      for (let x = 0; x < tiles; x += 1) {
        const v = parseInt(simplex.noise2D(9 * x / 100, 9 * y / 100) * 100);
        if((y >= 0 && y <= 5) || (y == 6 && x % 5 == 0) || (y >= tiles - 5 && y <= tiles - 1) || (y == tiles - 6 && x % 5 == 0) || (x >= 0 && x <= 5) || (x == 6 && y % 5 == 0) || (x >= tiles - 5 && x <= tiles) || (x == tiles - 6 && y % 5 == 0)) {
          img = water;
          lastValue = 0;
          treeImg = null;
        }
        else if(v > weight.snow) {
          img = snow;
          if(v % 5 == 0 && lastValue != 0) treeImg = tree_snow;
          else treeImg = null;
          lastValue = 1;
        }
        else if(v > weight.grass) {
          img = grass;
          if(v % 5 == 0 && lastValue != 0) treeImg = tree_green;
          else treeImg = null;
          lastValue = 1;
        }
        else {
          img = water;
          lastValue = 0;
          treeImg = null;
        }
        tmpArray.push(treeImg);
        ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
      }
      data.push(tmpArray);
      tmpArray = [];
    }
    for (let y = 0; y < tiles; y += 1) {
      for (let x = 0; x < tiles; x += 1) {
        if(data[x][y]) treeCtx.drawImage(data[x][y], y * tileSize, x * tileSize - tileSize, 24, 48);
      }
    }
    ctx.drawImage(treeCanvas, 0, 0);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'world.png');
    message.channel.send(attachment);
  },
};