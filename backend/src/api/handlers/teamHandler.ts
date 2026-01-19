import type { Team } from '../entities/index.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createTeam,
  getTeamLogo,
  getTeams,
  updateTeam,
} from '../repositories/teamRepository.ts';
import { updateTeamValidation } from '../validations/validations.ts';

export async function getTeamLogoHandler(id: number) {
  try {
    const response = await getTeamLogo(id);

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getTeamLogoHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar logo'
    );
  }
}

export async function getTeamsHandler(
  page: number = 1,
  limit: number = 10,
  id: number,
  idAdmin: number
) {
  try {
    const response = await getTeams(page, limit, id, idAdmin);

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getTeamsHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar times'
    );
  }
}

export async function createTeamHandler(
  name: string,
  logo: Buffer,
  contentType: string,
  user: number
) {
  try {
    const response = await createTeam(name, logo, contentType, user);

    await createLog(
      user,
      'CREATE_TEAM',
      `Time criado: ${name} (ID: ${response.id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createTeamHandler:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Erro desconhecido ao criar time'
    );
  }
}

export async function updateTeamHandler(
  body: Team,
  logo: Buffer | null,
  contentType: string | null,
  user: { id: number; role: string }
) {
  try {
    updateTeamValidation(body);

    const response = await updateTeam(body, logo, contentType, user);

    await createLog(
      user.id,
      'UPDATE_TEAM',
      `Time editado: ${response.name} (ID: ${response.id})${logo ? ' - Logo atualizado' : ''}`
    );

    return response.text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no updateTeamHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao editar time'
    );
  }
}
