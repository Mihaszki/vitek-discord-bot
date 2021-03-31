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
    const worldSize = 2048;
    const canvas = Canvas.createCanvas(worldSize, worldSize);
    const ctx = canvas.getContext('2d');
    const { prefix } = require('../bot_config');

    const seed = cleanText.emojis(message.cleanContent.slice(prefix.length + this.name.length + 1));

    const grass = await Canvas.loadImage('images/worldgen/grass.png');
    const snow = await Canvas.loadImage('images/worldgen/snow.png');
    const water = await Canvas.loadImage('images/worldgen/water.png');
    const tree_green = await Canvas.loadImage('images/worldgen/tree_grass.png');
    const tree_snow = await Canvas.loadImage('images/worldgen/tree_snow.png');
    let img = null;
    let treeImg = null;

    const simplex = new SimplexNoise(seed);
    let lastValue = 0;
    const tileSize = 32;
    const data = [];
    let tmpArray = [];
    const tiles = worldSize / tileSize;
    for (let y = 0; y < tiles; y += 1) {
      for (let x = 0; x < tiles; x += 1) {
        const v = parseInt(simplex.noise2D(9 * x / 100, 9 * y / 100) * 100);
        tmpArray.push(v);
        if(v > 40) {
          img = snow;
        }
        else if(v > -6) {
          img = grass;
        }
        else {
          img = water;
        }
        ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
      }
      data.push(tmpArray);
      tmpArray = [];
    }

    for (let y = 0; y < tiles; y += 1) {
      for (let x = 0; x < tiles; x += 1) {
        const v = data[y][x];
        if(v > 40) {
          if(v % 5 == 0 && lastValue != 0) treeImg = tree_snow;
          else treeImg = null;
          lastValue = 1;
        }
        else if(v > -6) {
          if(v % 5 == 0 && lastValue != 0) treeImg = tree_green;
          else treeImg = null;
          lastValue = 1;
        }
        else {
          lastValue = 0;
          treeImg = null;
        }
        if(treeImg) ctx.drawImage(treeImg, x * tileSize, y * tileSize - tileSize, 24, 48);
      }
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'world.png');
    message.channel.send(attachment);
  },
};