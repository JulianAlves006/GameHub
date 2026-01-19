import type { Award } from '../entities/index.ts';
import {
  getAwards,
  getAwardByID,
  createAward,
  updateAward,
  deleteAward,
} from '../repositories/awardRepository.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createAwardValidation,
  deleteAwardValidation,
  updateAwardValidation,
} from '../validations/validations.ts';

type GetAwardFn = (id?: Award['id']) => Promise<Award | Award[]>;

const strategies: Record<'withId' | 'withoutId', GetAwardFn> = {
  withId: async id => getAwardByID(id!),
  withoutId: async () => getAwards(),
};

export async function getAwardsHandler(body: any) {
  try {
    const { id } = body;
    const strategy = typeof id !== 'undefined' ? 'withId' : 'withoutId';
    return await strategies[strategy](id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getAwardsHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar listar os premios';
    throw new Error(errorMessage);
  }
}

export async function createAwardHandler(
  body: Award,
  user: { id: number; role: string }
) {
  try {
    const { description, value, medal, trophy, others } = body;
    createAwardValidation(body, user);

    const award = {
      description,
      value,
      medal,
      trophy,
      others,
      admin: { id: user.id },
    };
    const newAward = await createAward(award as Award);
    await createLog(
      user.id,
      'CREATE_AWARD',
      `Prêmio criado: ${description} (ID: ${newAward.id})`
    );
    return newAward;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createAwardHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar criar um premio';
    throw new Error(errorMessage);
  }
}

export async function updateAwardHandler(
  body: Award,
  user: { id: number; role: string }
) {
  try {
    const { id, description } = body;
    updateAwardValidation(body);

    const response = await updateAward(body, user);

    await createLog(
      user.id,
      'UPDATE_AWARD',
      `Prêmio editado: ${description} (ID: ${id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no updateAwardHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar editar um premio';
    throw new Error(errorMessage);
  }
}

export async function deleteAwardHandler(
  id: number,
  user: { id: number; role: string }
) {
  try {
    deleteAwardValidation(id);

    const { text, award } = await deleteAward(id, user);

    await createLog(
      user.id,
      'DELETE_AWARD',
      `Prêmio deletado: ${award.description} (ID: ${id})`
    );
    return text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteAwardHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar deletar um premio';
    throw new Error(errorMessage);
  }
}
