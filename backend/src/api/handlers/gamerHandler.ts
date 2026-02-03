import {
  createGamer,
  deleteGamer,
  getGamers,
  getTopGamers,
  updateGamer,
} from '../repositories/gamerRepository.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createGamerValidation,
  deleteGamerValidation,
  editGamerValidation,
} from '../validations/validations.ts';

export async function getTopGamersHandler() {
  try {
    const response = await getTopGamers();
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getTopGamersHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar listar os top gamers';
    throw new Error(errorMessage);
  }
}

export async function getGamersHandler(
  page: number = 1,
  limit: number = 10,
  id: number | null = null
) {
  try {
    const response = await getGamers(page, limit, id);

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getGamersHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar listar os gamers';
    throw new Error(errorMessage);
  }
}

export async function createGamerHandler(body: any) {
  try {
    const { shirtNumber, user } = body;
    createGamerValidation(body);

    const response = await createGamer(body);
    await createLog(
      user,
      'CREATE_GAMER',
      `Gamer criado: número ${shirtNumber} (ID: ${response.id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createGamerHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar criar o gamer';
    throw new Error(errorMessage);
  }
}

export async function updateGamerHandler(body: any) {
  try {
    const { id } = body;

    editGamerValidation(body);

    const response = await updateGamer(body);

    await createLog(
      response.gamerInfo.id,
      'UPDATE_GAMER',
      `Gamer editado: número ${response.gamerInfo.finalShirtNumber}${response.gamerInfo.scoreInfo} (ID: ${id})`
    );
    return response.text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no updateGamerHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar editar o gamer';
    throw new Error(errorMessage);
  }
}

export async function deleteGamerHandler(body: any) {
  try {
    const { id } = body;
    deleteGamerValidation(body);
    const response = await deleteGamer(body);
    if (response.userId) {
      await createLog(
        response.userId,
        'DELETE_GAMER',
        `Gamer deletado (ID: ${id})`
      );
    }
    return response.text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteGamerHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar editar o gamer';
    throw new Error(errorMessage);
  }
}
