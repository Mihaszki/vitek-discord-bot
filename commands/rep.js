module.exports = {
  name: 'rep',
  description: 'Reputation points',
  options: [
    {
      name: 'add',
      description: 'Give a positive point to the user',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'Enter a user',
          type: 'USER',
          required: true,
        },
        {
          name: 'reason',
          description: 'Enter a reason',
          type: 'STRING',
        },
      ],
    },
    {
      name: 'remove',
      description: 'Give a negative point to the user',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'Enter a user',
          type: 'USER',
          required: true,
        },
        {
          name: 'reason',
          description: 'Enter a reason',
          type: 'STRING',
        },
      ],
    },
    {
      name: 'ranking',
      description: 'Shows ranking',
      type: 'SUB_COMMAND',
    },
    {
      name: 'history',
      description: 'Shows user\'s history',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'Enter a user',
          type: 'USER',
        },
      ],
    },
    {
      name: 'history-full',
      description: 'Shows user\'s full history in html file',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'Enter a user',
          type: 'USER',
        },
      ],
    },
    {
      name: 'help',
      description: 'Shows help',
      type: 'SUB_COMMAND',
    },
  ],
  cooldown: 2,
  async execute(interaction) {
    const repController = require('../vitek_db/repController');
    const getMention = require('../vitek_modules/getMention');
    const { sendEmbed } = require('../vitek_modules/embed');
    const { prefix } = require('../bot_config');

    const option = interaction.options.getSubcommand();

    if(option == 'add') {
      repController.newRep(interaction, interaction.options.getMember('user'), interaction.options.getString('reason'), 1, '+rep');
    }
    else if(option == 'remove') {
      repController.newRep(interaction, interaction.options.getMember('user'), interaction.options.getString('reason'), -1, '-rep');
    }
    else if(option == 'ranking') {
      repController.getRanking(interaction.guild.id, interaction, items => {
        let description = `**Top 20 on** \`${interaction.guild.name}\`\n\n\`Place | User | Points\`\n`;
        if(items.length == 0) { description += '**NONE :(**'; }
        else {
          for(let i = 0; i < items.length; i++) {
            const member = getMention.member(`<@${items[i]._id.user_id}>`, interaction);
            description += `**${i + 1}.** | ${member ? member : items[i].username} | ${items[i].value}\n`;
          }
        }
        sendEmbed(interaction, `Rep - Top 20 | ${interaction.guild.name}`, description, interaction.guild.iconURL());
      });
    }
    else if(option == 'history') {
      let member = null;
      const usr = interaction.options.getMember('user');
      if(!usr) member = interaction.user;
      else member = usr.user;

      repController.getUserHistory(member.id, interaction.guild.id, interaction, (items, allPoints, pointsOnServer) => {
        let description = `All points: ${allPoints}\nPoints on \`${interaction.guild.name}\`: ${pointsOnServer}\n\n**Last 10 reps:**\n`;

        if(items.length == 0) { description += '**NONE :(**'; }
        else {
          description += '``Value | Reason | Sender``\n';
          for(const item of items) {
            description += `**${item.value}** | *${repController.sliceReason(item.reason)}* | <@${item.sender.user_id}>\n`;
          }
        }

        sendEmbed(interaction, `Rep - History | ${getMention.username(member)}`, description, getMention.avatar(member));
      });
    }
    else if(option == 'history-full') {
      let member = null;
      const usr = interaction.options.getMember('user');
      if(!usr) member = interaction.user;
      else member = usr.user;

      repController.getUserHistory(member.id, interaction.guild.id, interaction, (items, allPoints, pointsOnServer) => {
        const repHistoryHtmlTemplate = require('../vitek_modules/repHistoryHtmlTemplate');

        if(items.length == 0) { return interaction.reply({ content: 'Not enough data!' }); }
        else {
          repHistoryHtmlTemplate.sendHTML(getMention.username(member), getMention.avatar(member), member.id, items, allPoints, pointsOnServer, interaction);
        }
      }, null);
    }
    else if(option == 'help') {
      sendEmbed(interaction, 'Rep - Help', `\`${prefix}rep add <@User> <reason>\` - Give a positive point to the user
      \`${prefix}rep remove <@User> <reason>\` - Give a negative point to the user
      \`${prefix}rep history\` - Your rep history
      \`${prefix}rep history <@User>\` - User's rep history
      \`${prefix}rep history-full\` - Your full rep history
      \`${prefix}rep history-full <@User>\` - User's full rep history
      \`${prefix}rep ranking\` - Ranking`);
    }
  },
};