module.exports = {
  name: 'ai',
  description: 'Talk with bot',
  options: [
    {
      name: 'text',
      description: 'Enter a text',
      type: 'STRING',
      required: true,
    },
  ],
  cooldown: 0.5,
  execute(interaction) {
    const messageGenerator = require('../vitek_db/messageGenerator');
    messageGenerator.getMessage(interaction.options.getString('text'), interaction.guild.id, response => {
      if(response !== false) interaction.reply({ content: response });
    }, true, 2000);
  },
};