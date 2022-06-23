import { SlashCommandBuilder, userMention } from '@discordjs/builders';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { SlashCommand } from '../types';

export const HelloCommand: SlashCommand = {
  command: new SlashCommandBuilder().setName('hello').setDescription('Returns a simple greeting'),
  async run(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .setMinValues(2)
        .setMaxValues(3)
        .addOptions([
          {
            label: 'Select me',
            description: 'This is a description',
            value: 'first_option',
          },
          {
            label: 'You can select me too',
            description: 'This is also a description',
            value: 'second_option',
          },
          {
            label: 'I am also an option',
            description: 'This is a description as well',
            value: 'third_option',
          },
        ])
    );

    await interaction.reply({
      content: `Hello ${userMention(interaction.user.id)}`,
      components: [row],
    });
  },
};
