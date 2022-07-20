import { CommandInteraction, MessageEmbed } from 'discord.js';
import {
  addSheetToUser,
  deactivateSheetsByUser,
  deleteSheet,
  getAllSheetsByUser,
  getSheetsByName,
} from '../db/sheets';
import { getOrCreateUser } from './users';

export const sheetCreateSubcommand = async (interaction: CommandInteraction) => {
  const addSheet = async () => {
    await getOrCreateUser(userId, tag);
    return await addSheetToUser(userId, sheetName, active, portrait);
  };
  const buildEmbed = () => {
    const embed = new MessageEmbed()
      .setAuthor({ name: user.tag, iconURL: user.avatarURL() as string })
      .setTitle(sheetName)
      .setThumbnail(portrait)
      .setDescription('Sheet created successfully.')
      .setTimestamp(new Date());
    return embed;
  };
  const { user, options } = interaction;
  const userId = user.id;
  const tag = user.tag;
  const sheetName = options.getString('name') || '<missingno>';
  const portrait = options.getString('portrait_url') || '';
  const active = options.getBoolean('active') || false;

  if (active) await deactivateSheetsByUser(userId);

  await addSheet();

  const embed = buildEmbed();

  return embed;
};

// TODO use title and description for _active_ character and then
// have empty lines and then continue as normal...
// where there isn't an active sheet display 'sheet binder' or whatever
// and then list as normal

// TODO add reactions to select new active character
export const sheetListSubcommand = async (interaction: CommandInteraction) => {
  const buildEmbed = () => {
    const avatar = user.displayAvatarURL();

    const activeSheet = sheets?.find((sheet) => sheet.active);

    const fields = sheets
      ?.map((sheet) => {
        return {
          name: sheet.name + (sheet.active ? '*' : ''),
          value: `Last Modified: ${sheet.modifiedAt.toLocaleDateString()}`,
        };
      })
      .filter((field) => field.value);

    const embed = new MessageEmbed()
      .setAuthor({ name: user.tag, iconURL: avatar })
      .setTitle('Sheet Binder')
      .addFields(...fields)
      .setFooter({ text: '* Active sheet' });

    if (activeSheet) embed.setThumbnail(activeSheet.portraitUrl);

    return embed;
  };

  const { user } = interaction;
  const userId = user.id;

  await getOrCreateUser(userId);
  const sheets = await getAllSheetsByUser(userId);
  const embed = buildEmbed();

  await interaction.reply({
    embeds: [embed],
  });

  // TODO: ephemeral followup when active sheet selected
  // await interaction.followUp({ embeds: [activeSheetEmbed], ephemeral: true })
};

export const sheetDeleteSubcommand = async (interaction: CommandInteraction) => {
  const { user, options } = interaction;
  const userId = user.id;
  const sheetName = options.getString('name') || '';

  // TODO figure out how to deal with non-unique sheet names
  const sheets = await getSheetsByName(userId, sheetName);
  const sheet = sheets?.at(0);
  const embed = new MessageEmbed().setTitle(`Delete sheet '${sheetName}' failed`).setColor('RED');

  if (sheet) {
    const sheetId = sheet.id;
    const deleted = await deleteSheet(sheetId);

    if (deleted) {
      embed.setTitle(`Successfully deleted sheet '${sheetName}'`).setColor('GREEN');
    } else {
      embed.setDescription(`Something went wrong`);
    }
  } else {
    embed.setDescription(`Database does not contain sheet '${sheetName}'`);
  }

  return embed;
};
