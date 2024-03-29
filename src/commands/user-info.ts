import { roleMention, SlashCommandBuilder, userMention } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../types';

export const UserInfoCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Return information details for a user')
        .setRequired(true)
    )
    .setName('user_info')
    .setDescription('returns info of the user'),
  async run(interaction) {
    const getFormattedDate = (date: Date) => {
      return date.toLocaleDateString(interaction.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const user = interaction.options.getUser('user', true);
    const avatar = user.displayAvatarURL();
    const embed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle(user.tag)
      .setThumbnail(avatar)
      .addField('Registered On', getFormattedDate(user.createdAt), true);

    if (interaction.inGuild()) {
      const guild =
        interaction.guild || (await interaction.client.guilds.fetch(interaction.guildId));
      const member = guild.members.cache.get(user.id) || (await guild.members.fetch(user.id));
      const joinedAt = member.joinedAt;
      const roles = member.roles.cache;

      embed.setDescription(userMention(user.id));

      if (joinedAt) {
        embed.addField('Joined At', getFormattedDate(joinedAt), true);
      }

      const filteredRoles = roles
        .filter((role) => role.name !== '@everyone')
        .map((role) => roleMention(role.id));
      if (filteredRoles.length) {
        embed.addField(`Roles (${filteredRoles.length})`, `${filteredRoles.join(' ')}`);
      }
    }

    embed.setFooter({ text: `ID: ${user.id}` });
    await interaction.reply({
      embeds: [embed],
    });
  },
  help: 'This command returns the info of the user like the time when he/she joined to this server and to Discord, their profile picture, their roles, etc.',
};
