import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import { SlashCommands } from '../commands';

export const onReady = (client: Client) => {
  client.on('ready', async () => {
    console.log(`${client.user?.username} is online.`);
    const commands = SlashCommands.map(({ command }) => command.toJSON());
    await client.application?.commands
      .set(commands as ApplicationCommandDataResolvable[])
      .then(() => console.log('Commands set successfully.'));
  });
};
