const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Reputation points')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Give a positive point to the user')
        .addUserOption(option => option.setName('user').setDescription('Enter a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Give a negative point to the user')
        .addUserOption(option => option.setName('user').setDescription('Enter a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ranking')
        .setDescription('Rep ranking'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('history')
        .setDescription('Shows user\'s history')
        .addUserOption(option => option.setName('user').setDescription('Enter a user')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Shows help')),
  async execute(interaction) {
    const repController = require('../vitek_db/repController');
    const getMention = require('../vitek_modules/getMention');
    const { MessageAttachment } = require('discord.js');
    const { sendEmbed } = require('../vitek_modules/embed');
    const repHistoryHtmlTemplate = require('../vitek_modules/repHistoryHtmlTemplate');

    const option = interaction.options.getSubcommand();

    if (option == 'add') {
      repController.newRep(interaction, interaction.options.getMember('user'), interaction.options.getString('reason'), 1, '+rep');
    }
    else if (option == 'remove') {
      repController.newRep(interaction, interaction.options.getMember('user'), interaction.options.getString('reason'), -1, '-rep');
    }
    else if (option == 'ranking') {
      repController.getRanking(interaction.guild.id, interaction, items => {
        let description = `**Ranking for: ** \`${interaction.guild.name}\`\n\n\`Place | User | Points\`\n`;
        if (items.length == 0) { description += '**NONE :(**'; }
        else {
          for (let i = 0; i < items.length; i++) {
            const member = getMention.member(`<@${items[i]._id.user_id}>`, interaction);
            description += `**${i + 1}.** | ${member ? member : items[i].username} | ${items[i].value}\n`;
          }
        }
        sendEmbed(interaction, `Rep - Ranking | ${interaction.guild.name}`, description, getMention.guildIcon(interaction));
      });
    }
    else if (option == 'history') {
      let member = null;
      const usr = interaction.options.getMember('user');
      if (!usr) member = interaction.user;
      else member = usr.user;

      repController.getUserHistory(member.id, interaction.guild.id, interaction, (items, allPoints, pointsOnServer) => {
        let description = `All points: ${allPoints}\nPoints on \`${interaction.guild.name}\`: ${pointsOnServer}\n\n**Last 10 reps:**\n`;

        if (items.length == 0) { description += '**NONE :(**'; }
        else {
          description += '``Value | Reason | Sender``\n';
          for (const item of items) {
            description += `**${item.value}** | \`${repController.sliceReason(item.reason).replace(/`/g, '\'')}\` | <@${item.sender.user_id}>\n`;
          }
        }

        if (items.length > 0) {
          console.log(repHistoryHtmlTemplate.generateRepHistoryHTML(getMention.username(member), getMention.avatar(member), member.id, items, allPoints, pointsOnServer, interaction))
          const att = new MessageAttachment(Buffer.from(repHistoryHtmlTemplate.generateRepHistoryHTML(getMention.username(member), getMention.avatar(member), member.id, items, allPoints, pointsOnServer, interaction), 'UTF8'), 'rep_history_full_html.htm');
          return sendEmbed(interaction, `Rep - History | ${getMention.username(member)}`, description, getMention.avatar(member), att);
        }

        sendEmbed(interaction, `Rep - History | ${getMention.username(member)}`, description, getMention.avatar(member));
      });
    }
    else if (option == 'help') {
      sendEmbed(interaction, 'Rep - Help', `\`/rep add <@User> <reason>\` - Give a positive point to the user
      \`/rep remove <@User> <reason>\` - Give a negative point to the user
      \`/rep history\` - Your rep history
      \`/rep history <@User>\` - User's rep history
      \`/rep ranking\` - Ranking`);
    }
  },
};