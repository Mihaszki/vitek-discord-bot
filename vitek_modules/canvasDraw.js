module.exports = {
  wrapText: function(context, text, x, maxWidth) {
    const words = text.replace(/\s+/g, ' ').split(' ');
    let line = '';
    let lineCount = 0;
    let test = '';
    let metrics = '';
    let fontSize = 50;
    let y = 180;

    if(text.length > 1000) {fontSize = 21; y = 50;}
    else if(text.length > 560) {fontSize = 30; y = 40;}
    else if(text.length > 250) {fontSize = 40; y = 100;}

    context.fillStyle = 'black';
    context.font = `${fontSize}px arial, sans-serif`;

    for(let i = 0; i < words.length; i++) {
      test = words[i];
      metrics = context.measureText(test);
      while (metrics.width > maxWidth) {
        test = test.substring(0, test.length - 1);
        metrics = context.measureText(test);
      }
      if(words[i] != test) {
        words.splice(i + 1, 0,  words[i].substr(test.length))
        words[i] = test;
      } 
      test = line + words[i] + ' ';  
      metrics = context.measureText(test);
      if(metrics.width > maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + ' ';
        y += fontSize;
        lineCount++;
      }
      else {
        line = test;
      }
    }    
    context.fillText(line, x, y);
  },
};