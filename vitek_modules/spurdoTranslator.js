module.exports = {
  translate: function(text) {
    const endFace = [':---DD', ':--DDD', ':-DDDD', ':--DDD'];
		return text.toLowerCase()
    .replace(/t/g, 'd')
    .replace(/c/g, 'g')
    .replace(/p/g, 'b')
    .replace(/x/g, 'gs')
    .replace(/z/g, 's')
    .replace(/k/g, 'g')
    + ' ' + endFace[Math.floor(Math.random() * endFace.length)].toUpperCase();
  },
};