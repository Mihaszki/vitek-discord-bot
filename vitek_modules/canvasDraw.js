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

  getFontSize: function(text, canvas, offset = 50, startFontSize = 100, subtractNum = 10) {
    const context = canvas.getContext('2d');
    let fontSize = startFontSize;
    do {
      context.font = `${fontSize -= subtractNum}px sans-serif`;
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

  trimCanvas: function(c, _width, _height) {
    const Canvas = require('canvas');
    const ctx = c.getContext('2d');
    const copy = Canvas.createCanvas(_width, _height).getContext('2d');
    copy.quality = 'best';
    copy.patternQuality = 'best';
    const pixels = ctx.getImageData(0, 0, c.width, c.height);
    const l = pixels.data.length;
    const bound = {
      top: null,
      left: null,
      right: null,
      bottom: null,
    };
    let xx;
    let yy;

    for (let i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        xx = (i / 4) % c.width;
        yy = ~~((i / 4) / c.width);

        if (bound.top === null) {
          bound.top = yy;
        }

        if (bound.left === null) {
          bound.left = xx;
        }
        else if (xx < bound.left) {
          bound.left = xx;
        }

        if (bound.right === null) {
          bound.right = xx;
        }
        else if (bound.right < xx) {
          bound.right = xx;
        }

        if (bound.bottom === null) {
          bound.bottom = yy;
        }
        else if (bound.bottom < yy) {
          bound.bottom = yy;
        }
      }
    }

    const trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);
    return copy.canvas;
  },
};