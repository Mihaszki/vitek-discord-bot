module.exports = {
  count: function(text) {
    const { swearWordList } = require('../bot_config');
    const re = new RegExp(swearWordList, 'g');
    return ((text.replace(/\s/g, '').toLowerCase().replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z') || '').match(re) || []).length;
  },
};