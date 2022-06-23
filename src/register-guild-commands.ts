import { REST } from '@discordjs/rest';
import { APPLICATION_ID, GUILD_ID, TOKEN } from './config';
import { SlashCommands } from './commands';
import { Routes } from 'discord-api-types/v9';

const registerGuildCommands = async () => {
  try {
    const commands = SlashCommands.map(({ command }) => command.toJSON());
    const rest = new REST({ version: '9' }).setToken(TOKEN);
    console.log('Starting to refresh guild commands...');

    await rest
      .put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), {
        body: commands,
      })
      .then(() => console.log('Successfully registered application commands.'));

    console.log('Guild commands loaded successfully');
  } catch (err) {
    console.error(err);
  }
};

registerGuildCommands();
