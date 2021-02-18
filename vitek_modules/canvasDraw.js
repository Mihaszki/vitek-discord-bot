module.exports = {
  wrapText: function(context, text, { x, maxWidth, quoteAuthor, shadowColor, y = 180, fontColor = '#000000' }) {
    const cleanText = require('../vitek_modules/cleanText');
    const words = cleanText.emojis(text.replace(/\s+/g, ' ')).split(' ');
    let line = '';
    let test = '';
    let metrics = '';
    let fontSize = 50;

    if(text.length >= 1900) { y = 70; fontSize = 22; }
    else if(text.length >= 1800) { y = 60; fontSize = 24; }
    else if(text.length >= 1500) { y = 80; fontSize = 24; }
    else if(text.length >= 1000) { y = 130; fontSize = 24; }
    else if(text.length >= 600) { y = 180; fontSize = 25; }
    else if(text.length >= 500) { y = 150; fontSize = 30; }
    else if(text.length >= 400) { y = 140; fontSize = 39; }
    else if(text.length >= 300) { y = 150; fontSize = 40; }
    else if(text.length >= 200) { y = 130; fontSize = 40; }

    if(shadowColor) {
      context.shadowColor = shadowColor;
      context.shadowBlur = 2;
    }

    context.fillStyle = fontColor;
    context.font = `${fontSize}px sans-serif`;

    for(let i = 0; i < words.length; i++) {
      test = words[i];
      metrics = context.measureText(test);
      while (metrics.width > maxWidth) {
        test = test.substring(0, test.length - 1);
        metrics = context.measureText(test);
      }
      if(words[i] != test) {
        words.splice(i + 1, 0, words[i].substr(test.length));
        words[i] = test;
      }
      test = line + words[i] + ' ';
      metrics = context.measureText(test);
      if(metrics.width > maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + ' ';
        y += fontSize;
      }
      else {
        line = test;
      }
    }
    context.fillText(line, x, y);

    if(quoteAuthor) {
      context.textAlign = 'left';
      context.fillText(quoteAuthor, maxWidth, y + fontSize);
    }
  },

  getFontSize: function(text, canvas, offset = 50) {
    const context = canvas.getContext('2d');
    let fontSize = 100;
    do {
      context.font = `${fontSize -= 10}px sans-serif`;
    }
    while (context.measureText(text).width > canvas.width - offset);
    return context.font;
  },

  drawTextInBox: function(context, txt, font, x, y, w, h, angle) {
    angle = angle || 0;
    const fontHeight = 20;
    const hMargin = 1;
    context.font = fontHeight + 'px ' + font;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    const txtWidth = context.measureText(txt).width + 2 * hMargin;
    context.save();
    context.translate(x + w / 2, y);
    context.rotate(angle);
    context.scale(w / txtWidth, h / fontHeight);
    context.translate(hMargin, 0);
    context.fillText(txt, -txtWidth / 2, 0);
    context.restore();
  },
};