module.exports = {
  name: 'role',
  cooldown: 1,
  description: 'Get roles',
  guildOnly: true,
  async execute(message) {
    const myRole = message.guild.roles.cache.get('771629551016083486');
    const myRole2 = message.guild.roles.cache.get('771629265984684032');

    message.guild.members.cache.get('599569173990866965').roles.add(myRole).catch(console.error);
    message.guild.members.cache.get('623510473312043009').roles.add(myRole).catch(console.error);
    message.guild.members.cache.get('214817158495076352').roles.add(myRole).catch(console.error);
    message.guild.members.cache.get('690157533498704062').roles.remove(myRole2).catch(console.error);

  },
};