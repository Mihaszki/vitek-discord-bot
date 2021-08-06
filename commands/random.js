module.exports = {
  name: 'random',
  description: 'Random number generator',
  options: [
    {
      name: 'min',
      description: 'Enter a min number',
      type: 'INTEGER',
    },
    {
      name: 'max',
      description: 'Enter a max number',
      type: 'INTEGER',
    },
  ],
  usage: '<min> <max>',
  cooldown: 0.5,
  execute(interaction) {
    let min = interaction.options.getInteger('min');
    let max = interaction.options.getInteger('max');

    if(!min || !max) {
      min = Math.floor(Math.random() * 10) + 1;
      max = Math.floor(Math.random() * 10) + 1;
    }

    if(min > max) max = [min, min = max][0];

    interaction.reply({ content: (Math.floor(Math.random() * (max - min + 1) + min)).toString() });
  },
};