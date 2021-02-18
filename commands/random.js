module.exports = {
  name: 'random',
  description: 'Random number generator',
  usage: '<min> <max>',
  cooldown: 0.5,
  args: true,
  guildOnly: true,
  execute(message, args) {
    const isNumeric = (str) => {
      if (typeof str != 'string') return false;
      return !isNaN(str) && !isNaN(parseFloat(str));
    };

    if(!args[0] || !args[1]) return message.channel.send('You must give all two arguments!');
    else if(!isNumeric(args[0]) || !isNumeric(args[1])) return message.channel.send('It\'s not a number!');

    let min = args[0].includes('.') ? parseFloat(args[0]) : parseInt(args[0]);
    let max = args[1].includes('.') ? parseFloat(args[1]) : parseInt(args[1]);

    console.log(min, max);

    if(min > max) max = [min, min = max][0];

    let rand = 0;
    if(!args[0].includes('.') && !args[1].includes('.')) rand = Math.floor(Math.random() * (max - min + 1) + min);
    else rand = (Math.random() * (max - min) + min).toFixed(2);

    message.channel.send(rand);
  },
};