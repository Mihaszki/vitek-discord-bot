module.exports = {
  name: 'rep',
  description: 'Reputation stats',
  usage: 'help',
  cooldown: 1,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const Discord = require('discord.js');
    const repController = require('../vitek_db/repController');
    const getMention = require('../vitek_modules/getMention');
    const { prefix } = require('../bot_config.json');

    if(args[0] == 'history') {
      let member = null;
      if(!args[1]) member = getMention.member(`<@${message.author.id}>`, message);
      else member = getMention.member(args[1], message);
      if(!member) return message.channel.send('You must select one user that is on the server!');

      repController.getUserHistory(member.id, message.guild.id, message, (items, allPoints, pointsOnServer) => {
        let description = `**All points:** ${allPoints}\n**Points on the server:** ${pointsOnServer}\n**Last 10 reps:**\n\n`;

        if(items.length == 0) { description += '**NONE :(**'; }
        else {
          for(const item of items) {
            description += `**${item.value}** | *${repController.sliceReason(item.reason)}* | <@${item.sender.user_id}>\n`;
          }
        }

        sendEmbed(`Rep - History | ${getMention.username(member)}`, description, getMention.avatar(member));
      });
    }
    else {
      sendEmbed('Rep - Help', `\`\`${prefix}+rep <@User> <optional reason>\`\` - Give a positive point to the user
      \`\`${prefix}-rep <@User> <optional reason>\`\` - Give a negative point to the user
      \`\`${prefix}rep history\`\` - Your rep history
      \`\`${prefix}rep history <@User>\`\` - Check someone's rep history
      \`\`${prefix}rep ranking\`\` - Ranking`);
    }

    function sendEmbed(title, description, avatar = null) {
      const embed = new Discord.MessageEmbed()
        .setColor('#fff200')
        .setTitle(title)
        .setThumbnail(avatar == null ? message.client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) : avatar)
        .setDescription(description);
      message.channel.send(embed);
    }
  },
};