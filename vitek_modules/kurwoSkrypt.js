module.exports = {
  run: function(text) {
    const msg = text;
    const word = 'kurwa';
    let new_msg = '';
    const curse_words1 = ['pierdoloną', 'chujową', 'popierdoloną'];
    const curse_words2 = ['pierdolonych', 'chujowych', 'popierdolonych'];
    const curse_words3 = ['chujowymi', 'jebiącymi', 'popierdolonymi', 'pierdolonymi'];
    const curse_words4 = ['ruchające', 'jebiące'];
    const curse_words5 = ['ruchała', 'jebała'];
    let word_count = 3;
    let kurwa_counter = 0;
    let kurwa_counter_word = 'kurew';

    const randNum = (a = 5) => {
      const x = Math.floor(Math.random() * 10);
      if(x > a) return true;
      else return false;
    };

    for(let i = 0; i < msg.length; i++) {
      if(msg[i] == ',' && msg[i + 1] != ',') {
        if(randNum()) {
          new_msg += ' ' + word + ',';
          kurwa_counter++;
        }
        else {new_msg += msg[i];}
      }
      else if(msg[i] == '!' && msg[i + 1] == ' ') {
        if(randNum()) {
          new_msg += '! ' + word.replace('k', 'K');
          kurwa_counter++;
        }
        else {new_msg += msg[i];}
      }
      else if(msg[i] == '?' && msg[i + 1] == ' ') {
        if(randNum()) {
          new_msg += '? ' + word.replace('k', 'K');
          kurwa_counter++;
        }
        else {new_msg += msg[i];}
      }
      else if(msg[i] == ' ' && msg[i - 1] != ',') {
        if(word_count >= 3) {
          if(msg[i - 1] == '.') {new_msg += ' ' + word.replace('k', 'K') + ' ';}
          else {new_msg += ' ' + word + ' ';}
          kurwa_counter++;
          word_count = 0;
        }
        else {new_msg += msg[i]; word_count++;}
      }
      else {new_msg += msg[i];}
    }

    const words = new_msg.split(' ');

    if(words.length < 3) {
      words[0] = 'Kurwa ' + words[0];
      kurwa_counter++;
    }

    new_msg = '';
    word_count = 3;

    for (let i = 0; i < words.length; i++) {
      if(randNum(3) && words[i].slice(-3) == 'ową' && words[i] != 'ową' && !curse_words1.includes(words[i])) {
        words[i] = curse_words1[Math.floor(Math.random() * curse_words1.length)] + ' ' + words[i];
      }
      else if(randNum(3) && words[i].slice(-4) == 'nych' && words[i] != 'nych' && !curse_words2.includes(words[i])) {
        words[i] = curse_words2[Math.floor(Math.random() * curse_words2.length)] + ' ' + words[i];
      }
      else if(randNum(3) && words[i].slice(-5) == ',nych' && words[i] != ',nych' && !curse_words2.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words2[Math.floor(Math.random() * curse_words2.length)];
      }
      else if(randNum(3) && words[i].slice(-4) == ',ową' && words[i] != ',ową' && !curse_words1.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words1[Math.floor(Math.random() * curse_words1.length)];
      }
      else if(randNum(3) && words[i].slice(-3) == 'ymi' && words[i] != 'ymi' && !curse_words3.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words3[Math.floor(Math.random() * curse_words3.length)];
      }
      else if(randNum(3) && words[i].slice(-4) == ',ymi' && words[i] != ',ymi' && !curse_words3.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words3[Math.floor(Math.random() * curse_words3.length)];
      }
      else if(randNum(3) && words[i].slice(-3) == 'ące' && words[i] != 'ące' && !curse_words4.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words4[Math.floor(Math.random() * curse_words4.length)];
      }
      else if(randNum(3) && words[i].slice(-4) == ',ące' && words[i] != ',ące' && !curse_words4.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words4[Math.floor(Math.random() * curse_words4.length)];
      }
      else if(randNum(3) && words[i].slice(-3) == 'ała' && words[i] != 'ała' && !curse_words5.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words5[Math.floor(Math.random() * curse_words5.length)];
      }
      else if(randNum(3) && words[i].slice(-4) == ',ała' && words[i] != ',ała' && !curse_words5.includes(words[i])) {
        words[i] = words[i] + ' ' + curse_words5[Math.floor(Math.random() * curse_words5.length)];
      }

      if(words[i][words[i].length - 1] == '.' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }
      else if(words[i][words[i].length - 1] == '?' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }
      else if(words[i][words[i].length - 1] == '!' && words[i + 1] == 'Kurwa' && words[i + 2]) {
        words[i + 2] = words[i + 2].replace(words[i + 2][0], words[i + 2][0].toLowerCase());
      }

      new_msg += words[i];
      if(i != words.length - 1) new_msg += ' ';
    }

    if(kurwa_counter == 1) kurwa_counter_word = 'kurwa';
    else kurwa_counter_word = 'kurwas';

    new_msg += '\n\n||**Added ' + kurwa_counter + ' ' + kurwa_counter_word + '.**||';
    return new_msg;
  },
};