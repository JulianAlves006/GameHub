import type { User } from '../entities/User.ts';
import {
  deleteAwardChampionship,
  getAwardChampionship,
} from '../repositories/awardChampionshipRepository.ts';
import { createLog } from '../repositories/logRepository.ts';
import { deleteAwardChampionshipValidation } from '../validations/validations.ts';

export async function getAwardChampionshipHandler(
  idAward: number,
  idChampionship: number
) {
  try {
    const response = await getAwardChampionship(idAward, idChampionship);

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getAwardChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar listar os premios dos campeonatos';
    throw new Error(errorMessage);
  }
}

export async function deleteAwardChampionshipHandler(
  ids: number[],
  user: { id: number; role: string }
) {
  try {
    deleteAwardChampionshipValidation(ids, user);

    const response = deleteAwardChampionship(ids, user);

    await createLog(
      user.id,
      'DELETE_AWARD_CHAMPIONSHIP',
      `${ids.length} prêmio(s) removido(s) do campeonato`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteAwardChampionshipHandler: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao tentar deletar os premios de um campeonato';
    throw new Error(errorMessage);
  }
}
