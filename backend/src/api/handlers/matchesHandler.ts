import type { Match } from '../entities/index.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createMatch,
  deleteMatch,
  getMatches,
  getMatchesPlayingFinishedCount,
  updateMatch,
} from '../repositories/matchesRepository.ts';
import { updateMatchesService } from '../services/matchesService.ts';
import {
  createMatchValidation,
  deleteMatchValidation,
  updateMatchValidation,
} from '../validations/validations.ts';

export async function getMatchesPlayingFinishedCountHandler() {
  try {
    const response = getMatchesPlayingFinishedCount();
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getMatchesPlayingFinishedCountHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar contador de partidas jogando e finalizadas'
    );
  }
}

export async function getMatchesHandler(
  page: number = 1,
  limit: number = 10,
  idChampionship: number,
  idMatch: number,
  idTeam: number
) {
  try {
    const response = getMatches(page, limit, idChampionship, idMatch, idTeam);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getMatchesHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar partidas'
    );
  }
}

export async function createMatchHandler(
  body: Match,
  user: { id: number; role: string }
) {
  try {
    createMatchValidation(body, user);

    const response = await createMatch(body, user);

    if (response.matchId) {
      await createLog(
        user.id,
        'CREATE_MATCH',
        `Partida criada: Time ${response.team1Id} vs Time ${response.team2Id} (ID: ${response.matchId})`
      );
    }

    return response.savedMatch;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createMatchHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao criar partida'
    );
  }
}

export async function updateMatchHandler(
  body: Match,
  user: { id: number; role: string }
) {
  try {
    const { id, winner, status, scoreTeam1, scoreTeam2 } = body;
    updateMatchValidation(id, user);

    const response = await updateMatch(body, user);
    const matchesCount = await getMatchesPlayingFinishedCount();

    updateMatchesService(matchesCount);

    const scoreText =
      scoreTeam1 !== undefined && scoreTeam2 !== undefined
        ? `, Placar: ${scoreTeam1} x ${scoreTeam2}`
        : '';

    await createLog(
      user.id,
      'UPDATE_MATCH',
      `Partida editada (ID: ${id}) -${status ? `Status: ${status}` : ''}${scoreText}${winner ? `, Vencedor: ${winner}` : ''}`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no updateMatchHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao editar partida'
    );
  }
}

export async function deleteMatchHandler(
  id: number,
  user: { id: number; role: string }
) {
  try {
    deleteMatchValidation(id, user);
    const response = await deleteMatch(id, user);
    await createLog(user.id, 'DELETE_MATCH', `Partida deletada (ID: ${id})`);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no deleteMatchHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao deletar partida'
    );
  }
}
