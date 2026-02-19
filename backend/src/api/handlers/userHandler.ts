import argon2 from 'argon2';
import {
  createUserValidation,
  deleteUserValidation,
  updateUserValidation,
} from '../validations/validations.ts';
import {
  createUser,
  deleteUser,
  getUserByID,
  getUsers,
  getUserProfilePicture,
  updateUser,
} from '../repositories/userRepository.ts';
import { createLog } from '../repositories/logRepository.ts';
import type { User } from '../entities/index.ts';

type GetUserFn = (id?: User['id']) => Promise<User | User[]>;

const strategies: Record<'withId' | 'withoutId', GetUserFn> = {
  withId: async id => getUserByID(id!),
  withoutId: async () => getUsers(),
};

export async function getUserHandler(id?: User['id']): Promise<User | User[]> {
  try {
    const strategy = typeof id !== 'undefined' ? 'withId' : 'withoutId';
    return await strategies[strategy](id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getUserHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar usuário(s)'
    );
  }
}

export async function createUserHandler(
  body: User,
  profilePicture: Buffer | null = null,
  contentType: string | null = null
) {
  try {
    const { name, email, password, profile, cpf } = body;
    createUserValidation(body);

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const user = {
      name,
      email,
      password: passwordHash,
      profile,
      cpf,
      isActive: 1,
    };

    const newUser = await createUser(user as User, profilePicture, contentType);
    await createLog(
      newUser.id,
      'CREATE_USER',
      `Usuário criado: ${name} (${email})`
    );

    return newUser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createUserHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido no cadastro de usuário';
    throw new Error(errorMessage);
  }
}

export async function updateUserHandler(
  body: any,
  profilePicture: Buffer | null = null,
  contentType: string | null = null
) {
  try {
    const { id, name, email, password } = body;
    updateUserValidation(body);
    let newUser: Partial<User> & { id: number };
    if (password) {
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      });
      newUser = {
        id,
        name,
        email,
        password: passwordHash,
      };
    } else {
      newUser = {
        id,
        name,
        email,
      };
    }

    const response = await updateUser(newUser, profilePicture, contentType);

    await createLog(
      newUser.id,
      'UPDATE_USER',
      `Usuário editado: ${newUser.name} (${newUser.email})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no updateUserHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido na edição de usuário';
    throw new Error(errorMessage);
  }
}

export async function deleteUserHandler(
  id: User['id'],
  userData: { id: number; role: string }
) {
  try {
    deleteUserValidation(id, userData.role);

    const response = deleteUser(id);

    await createLog(
      userData.id,
      'DELETE_USER',
      `Usuário deletado (ID: ${id}) por admin`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteUserHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido na deleção de usuário';
    throw new Error(errorMessage);
  }
}

export async function getUserProfilePictureHandler(id: number) {
  try {
    const user = await getUserProfilePicture(id);
    return user;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getUserProfilePictureHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar foto de perfil';
    throw new Error(errorMessage);
  }
}
