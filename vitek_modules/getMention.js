module.exports = {
  member: function(arg, message) {
    const mentioned_user1 = arg.match(/<@!?(\d+)>/);
    if(!mentioned_user1 || !message.guild.members.cache.get(mentioned_user1[1])) return false;
    else return message.guild.members.cache.get(mentioned_user1[1]);
  },

  member_interaction: function(arg, interaction) {
    const mentioned_user1 = arg.match(/<@!?(\d+)>/);
    if(!mentioned_user1 || !interaction.guild.members.cache.get(mentioned_user1[1])) return false;
    else return interaction.guild.members.cache.get(mentioned_user1[1]);
  },

  username: function(member) {
    if(member.displayName) return member.displayName;
    else return member.username;
  },

  avatar: function(member) {
    return member.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
  },
};