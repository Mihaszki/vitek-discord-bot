module.exports = {
  wrapText: function(context, text, args = { x: null, maxWidth: null, quoteAuthor: null, shadowColor: null, y: 180, fontColor: 'black' }) {
    const cleanText = require('../vitek_modules/cleanText');
    const words = cleanText.emojis(text.replace(/\s+/g, ' ')).split(' ');
    let line = '';
    let test = '';
    let metrics = '';
    let fontSize = 50;
    let y = 0;
    const x = args.x;

    if(text.length >= 1900) { y = 70; fontSize = 22; }
    else if(text.length >= 1800) { y = 60; fontSize = 24; }
    else if(text.length >= 1500) { y = 80; fontSize = 24; }
    else if(text.length >= 1000) { y = 130; fontSize = 24; }
    else if(text.length >= 600) { y = 180; fontSize = 25; }
    else if(text.length >= 500) { y = 150; fontSize = 30; }
    else if(text.length >= 400) { y = 140; fontSize = 39; }
    else if(text.length >= 300) { y = 150; fontSize = 40; }
    else if(text.length >= 200) { y = 130; fontSize = 40; }
    else { y = args.y; }

    if(args.shadowColor) {
      context.shadowColor = args.shadowColor;
      context.shadowBlur = 2;
    }

    context.fillStyle = args.fontColor;
    context.font = `${fontSize}px sans-serif`;

    for(let i = 0; i < words.length; i++) {
      test = words[i];
      metrics = context.measureText(test);
      while (metrics.width > args.maxWidth) {
        test = test.substring(0, test.length - 1);
        metrics = context.measureText(test);
      }
      if(words[i] != test) {
        words.splice(i + 1, 0, words[i].substr(test.length));
        words[i] = test;
      }
      test = line + words[i] + ' ';
      metrics = context.measureText(test);
      if(metrics.width > args.maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + ' ';
        y += fontSize;
      }
      else {
        line = test;
      }
    }
    context.fillText(line, x, y);

    if(args.quoteAuthor) {
      context.textAlign = 'left';
      context.fillText(args.quoteAuthor, args.maxWidth, y + fontSize);
    }
  },

  getFontSize: function(text, canvas, offset = 50) {
    const ctx = canvas.getContext('2d');
    let fontSize = 100;
    do {
      ctx.font = `${fontSize -= 10}px sans-serif`;
    }
    while (ctx.measureText(text).width > canvas.width - offset);
    return ctx.font;
  },
};