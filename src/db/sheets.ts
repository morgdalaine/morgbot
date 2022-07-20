import prisma from '.';
import { Sheet } from '@prisma/client';

export const getSheetById = async (id: string): Promise<Sheet | null> => {
  const sheet = await prisma.sheet.findUnique({
    where: {
      id,
    },
  });
  return sheet;
};

export const getAllSheetsByUser = async (userId: string): Promise<Array<Sheet> | null> => {
  const sheets = await prisma.sheet.findMany({
    where: {
      userId,
    },
  });

  return sheets;
};

export const getSheetsByName = async (
  userId: string,
  name: string
): Promise<Array<Sheet> | null> => {
  const sheets = await prisma.sheet.findMany({
    where: {
      userId,
      name,
    },
  });
  return sheets;
};

export const addSheetToUser = async (
  userId: string,
  name: string,
  active: boolean,
  portraitUrl: string
) => {
  return await prisma.sheet.create({
    data: {
      userId,
      name,
      active,
      portraitUrl,
    },
  });
};

export const deleteSheet = async (id: string): Promise<Sheet | null> => {
  return prisma.sheet.delete({
    where: {
      id,
    },
  });
};

export const deactivateSheetsByUser = async (userId: string) => {
  return await prisma.sheet.updateMany({
    data: {
      active: false,
    },
    where: {
      userId,
      active: true,
    },
  });
};

const buildSkillModalRoll = (values, options) => {
  const min = -30 - parseInt(values.skillroll_modal_skill_peril);
  const max = 30 - parseInt(values.skillroll_modal_skill_peril);
  const baseModifiers = values.skillroll_modal_bonus
    ? `+ ${Math.min(
        Math.max(parseInt(values.skillroll_modal_bonus), min),
        max
      )}[${getTranslationByKey('roll_bonus')}] `
    : '';
  const dr =
    values.skill_difficulty_rating && !options.secret
      ? `+ @{skill_difficulty_rating}[${getTranslationByKey('difficulty_query')}]`
      : '';
  values['skillroll_modal_roll'] = values['skillroll_modal_roll']
    .replace(`+ @{modifier_query}[${getTranslationByKey('modifier_query')}]`, baseModifiers)
    .replace(`+ @{difficulty_query}[${getTranslationByKey('difficulty_query')}]`, dr);
  values['skillroll_modal_roll'] += options.opposed
    ? `{{opposed=[[${values['skillroll_modal_attribute'] || 0}]]}}`
    : '';
  values['skillroll_modal_roll'] +=
    options.flipFail || options.flipSuccess
      ? `{{flipDirection=${
          options.flipFail
            ? getTranslationByKey('skill_flip_fail')
            : getTranslationByKey('skill_flip_success')
        }}}{{flip=[[0]]}} {{flipped=[[0]]}}`
      : '';
  values['skillroll_modal_roll'] += options.assisted ? `{{assisted=[[1d10]]}}` : '';
  // console.log(values["skillroll_modal_roll"])
  return values['skillroll_modal_roll'];
};
