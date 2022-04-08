module.exports = {
  member: function(arg, message) {
    const mentionedUser1 = arg.match(/<@!?(\d+)>/);
    if (!mentionedUser1 || !message.guild.members.cache.get(mentionedUser1[1])) return false;
    else return message.guild.members.cache.get(mentionedUser1[1]);
  },

  memberInteraction: function(arg, interaction) {
    const mentionedUser1 = arg.match(/<@!?(\d+)>/);
    if (!mentionedUser1 || !interaction.guild.members.cache.get(mentionedUser1[1])) return false;
    else return interaction.guild.members.cache.get(mentionedUser1[1]);
  },

  username: function(member) {
    if (member.displayName) return member.displayName;
    else return member.username;
  },

  avatar: function(member) {
    return member.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
  },

  guildIcon: function(interaction) {
    return interaction.guild.iconURL() || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
  },
};