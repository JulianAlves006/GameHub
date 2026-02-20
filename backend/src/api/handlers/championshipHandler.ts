import type {
  Award,
  AwardsChampionship,
  Championship,
} from '../entities/index.ts';
import {
  createChampionchip,
  deleteChampionship,
  editChampionship,
  getChampionship,
} from '../repositories/championshipRepository.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createChampionchipValidation,
  deleteChampionshipValidation,
  editChampionshipValidation,
} from '../validations/validations.ts';

export async function getChampionshipHandler(
  idChampionship: number | undefined,
  idAdmin: number | undefined,
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await getChampionship(
      idChampionship,
      idAdmin,
      page,
      limit
    );
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar listar os campeonatos';
    throw new Error(errorMessage);
  }
}

export async function createChampionshipHandler(
  championshipData: Championship,
  awards: Award[],
  user: { id: number; role: string }
) {
  try {
    const { name } = championshipData;
    createChampionchipValidation(championshipData, user);

    const response = await createChampionchip(championshipData, awards, user);

    await createLog(
      user.id,
      'CREATE_CHAMPIONSHIP',
      `Campeonato criado: ${name} (ID: ${response.id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar criar um campeonato';
    throw new Error(errorMessage);
  }
}

export async function editChampionshipHandler(
  championshipData: Championship,
  awards: AwardsChampionship[],
  user: { id: number; role: string }
) {
  try {
    const { id, name } = championshipData;
    editChampionshipValidation(name);
    const response = await editChampionship(championshipData, awards, user);

    await createLog(
      user.id,
      'UPDATE_CHAMPIONSHIP',
      `Campeonato editado: ${name} (ID: ${id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no editChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar editar um campeonato';
    throw new Error(errorMessage);
  }
}

export async function deleteChampionshipHandler(
  id: number,
  user: { id: number; role: string }
) {
  try {
    deleteChampionshipValidation(id);

    const response = await deleteChampionship(id, user);

    await createLog(
      user.id,
      'DELETE_CHAMPIONSHIP',
      `Campeonato deletado: ${response.championship.name} (ID: ${id})`
    );

    return response.text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar deletar um campeonato';
    throw new Error(errorMessage);
  }
}
