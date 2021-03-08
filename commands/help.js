module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command',
  usage: '<command name>',
  cooldown: 1,
  execute(message, args) {
    const { prefix } = require('../bot_config');
    const data = [];
    const { commands } = message.client;
    const { sendEmbed } = require('../vitek_modules/embed');

    if(args[0]) {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) return message.reply('That\'s not a valid command!');

      data.push(`:arrow_right: **Name:** \`${command.name}\``);

      if (command.description) data.push(`:question: **Description:** \`${command.description}\``);
      if (command.usage) data.push(`:wrench: **Usage:** \`${prefix}${command.name} ${command.usage}\``);

      data.push(`:clock1: **Cooldown:** \`${command.cooldown || 3} second(s)\``);

      return sendEmbed(message, `Help | ${command.name}`, data);
    }

    data.push('**Commands:**');
    data.push(`\`\`\`${commands.map(command => command.name).join(', ')}\`\`\``);
    data.push('You can talk with bot by using `.<message>` e.g. `.Hello!`. If the bot finds a response based on messages on your server, you will get a reply.');
    data.push(`\nYou can send \`${prefix}help <command name>\` to get info on a specific command :robot:`);
    return sendEmbed(message, 'Help', data);
  },
};