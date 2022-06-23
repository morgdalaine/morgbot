import { createUser, getUserById } from '../db/users';
import { client } from '../main';

export const getOrCreateUser = async (id: string, tag?: string) => {
  const existingUser = await getUserById(id);
  if (existingUser) {
    return existingUser;
  }
  if (!tag) {
    const user = await client.users.fetch(id);
    tag = user.tag;
  }
  const createdUser = await createUser(id, tag);
  return createdUser;
};
