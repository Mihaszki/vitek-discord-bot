module.exports = {
  run: function(text, showStats = true) {
    const msg = text;
    const word = 'kurwa';
    let newMsg = '';
    let wordCount = 3;
    let kurwaCounter = 0;
    let kurwaCounterWord = 'kurwas';

    const randNum = (a = 5) => {
      const x = Math.floor(Math.random() * 10);
      if (x > a) return true;
      else return false;
    };

    for (let i = 0; i < msg.length; i++) {
      if (msg[i] == ',' && msg[i + 1] != ',') {
        if (randNum()) {
          newMsg += ' ' + word + ',';
          kurwaCounter++;
        }
        else {newMsg += msg[i];}
      }
      else if (msg[i] == '!' && msg[i + 1] == ' ') {
        if (randNum()) {
          newMsg += '! ' + word.replace('k', 'K');
          kurwaCounter++;
        }
        else {newMsg += msg[i];}
      }
      else if (msg[i] == '?' && msg[i + 1] == ' ') {
        if (randNum()) {
          newMsg += '? ' + word.replace('k', 'K');
          kurwaCounter++;
        }
        else {newMsg += msg[i];}
      }
      else if (msg[i] == ' ' && msg[i - 1] != ',') {
        if (wordCount >= 3) {
          if (msg[i - 1] == '.') {newMsg += ' ' + word.replace('k', 'K') + ' ';}
          else {newMsg += ' ' + word + ' ';}
          kurwaCounter++;
          wordCount = 0;
        }
        else {newMsg += msg[i]; wordCount++;}
      }
      else {newMsg += msg[i];}
    }

    const words = newMsg.split(' ');

    if (words.length < 3) {
      words[0] = 'Kurwa ' + words[0];
      kurwaCounter++;
    }

    newMsg = '';
    wordCount = 3;

    for (let i = 0; i < words.length; i++) {
      if (words[i][words[i].length - 1] == '.' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }
      else if (words[i][words[i].length - 1] == '?' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }
      else if (words[i][words[i].length - 1] == '!' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }

      newMsg += words[i];
      if (i != words.length - 1) newMsg += ' ';
    }

    if (kurwaCounter == 1) kurwaCounterWord = 'kurwa';
    else kurwaCounterWord = 'kurwas';

    if (showStats) newMsg += '\n\n||**Added ' + kurwaCounter + ' ' + kurwaCounterWord + '.**||';
    return newMsg;
  },
};