import { Client, Intents } from 'discord.js';
import { TOKEN } from './config';
import {
  onInteractionCreate,
  onMessageCreate,
  onMessageReactionAdd,
  onMessageReactionRemove,
  onReady,
} from './events';

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

onReady(client);
onMessageCreate(client);
onInteractionCreate(client);
onMessageReactionAdd(client);
onMessageReactionRemove(client);

client.login(TOKEN);
