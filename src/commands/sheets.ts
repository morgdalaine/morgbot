import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../types';
import { sheetCreateSubcommand, sheetDeleteSubcommand, sheetListSubcommand } from '../utils/sheets';
import { getOrCreateUser } from '../utils/users';

export const SheetCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Create new sheet')
        .addStringOption((option) =>
          option.setName('name').setDescription('Sheet name').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('portrait_url').setDescription('URL to sheet portrait')
        )
        .addBooleanOption((option) =>
          option.setName('active').setDescription('Set as active sheet for this server')
        )
    )
    .addSubcommand((subcommand) => subcommand.setName('list').setDescription('List user sheets'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set_active_sheet')
        .setDescription('Set active sheet')
        .addStringOption((option) =>
          option.setName('name').setDescription('Sheet name').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('List user sheets')
        .addStringOption((option) =>
          option.setName('name').setDescription('Sheet name').setRequired(true)
        )
    )
    .setName('sheet')
    .setDescription('Access sheet commands to manage the characters a user'),
  async run(interaction) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();

    switch (subcommand) {
      case 'create': {
        await sheetCreateSubcommand(interaction);
        break;
      }
      case 'list': {
        await sheetListSubcommand(interaction);
        break;
      }
      case 'delete': {
        await sheetDeleteSubcommand(interaction);
        break;
      }
      default: {
        const embed = new MessageEmbed()
          .setTitle(`Subcommand \`${subcommand}\` failed to run`)
          .setDescription('Please consult the manual and try again')
          .setColor('RED');
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }
  },
};
