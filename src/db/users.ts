import prisma from '.';
import { User } from '@prisma/client';

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const createUser = async (id: string, tag: string) => {
  return prisma.user.create({
    data: {
      id,
      tag,
    },
  });
};

export const upsertUser = async (user: User) => {
  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: user,
    create: user,
  });
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};
