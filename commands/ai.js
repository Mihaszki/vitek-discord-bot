const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Talk with bot. You can also use .<text>')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Enter a text')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const messageGenerator = require('../vitek_db/messageGenerator');
    messageGenerator.getMessage(interaction.options.getString('text'), interaction.guild.id, response => {
      if(response !== false) interaction.editReply({ content: response });
    }, true, 2000);
  },
};