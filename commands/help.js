module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command',
  usage: '<command name>',
  cooldown: 1,
  execute(message, args) {
    const { prefix } = require('../bot_config.json');
    const data = [];
    const { commands } = message.client;

    if(args[0]) {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) return message.reply('That\'s not a valid command!');

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
      return message.channel.send(data, { split: true });
    }

    data.push('Here\'s a list of all my commands:');
    data.push(commands.map(command => command.name).join(', '));
    data.push(`\nYou can send \`${prefix}help <command name>\` to get info on a specific command!`);
    message.channel.send(data, { split: true });
  },
};