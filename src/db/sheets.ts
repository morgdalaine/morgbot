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
