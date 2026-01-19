import argon2 from 'argon2';
import type { Championship, Match, Metric, Team } from '../entities/index.ts';

export async function checkPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return await argon2.verify(passwordHash, plainPassword);
}

export function loginValidation(body: any) {
  const { email, password } = body;
  if (!email || !password) throw new Error('Email e senha são obrigatórios!');
}

export function createUserValidation(body: any) {
  const { name, email, password, profile } = body;
  if (!name || !email || !password || !profile)
    throw new Error('Informações faltando!');
}

export function updateUserValidation(body: any) {
  const { id, name, email } = body;
  if (!name || !email || !id) throw new Error('Informações faltando!');
}

export function deleteUserValidation(id: number, role: string) {
  if (!id) throw new Error('Id é obrigatório para essa requisição');
  if (role !== 'admin')
    throw new Error(
      'Somente usuários administradores podem excluir outros usuários'
    );
}

export function createGamerValidation(body: any) {
  const { shirtNumber, user } = body;

  if (!shirtNumber || !user)
    throw new Error(
      'As informações obrigatórias devem estar preenchidas. (shirtNumber && user)'
    );
}

export function editGamerValidation(body: any) {
  const { id } = body;
  if (!id) throw new Error('ID precisa estar preenchido para a edição');
}

export function deleteGamerValidation(body: any) {
  const { id } = body;
  if (!id) throw new Error('Id está vazio!');
}

export function deleteAwardChampionshipValidation(
  ids: number[],
  user: { id: number; role: string }
) {
  if (!ids || ids.length === 0)
    throw new Error('IDs são obrigatórios para a requisição');
  if (user.role !== 'admin')
    throw new Error('Este usuário não pode realizar esta ação');
}

export function createAwardValidation(
  body: any,
  user: { id: number; role: string }
) {
  const { description, value, medal, trophy, others } = body;
  if (
    !description ||
    value === null ||
    value === undefined ||
    medal === null ||
    medal === undefined ||
    trophy === null ||
    trophy === undefined ||
    !others
  )
    throw new Error('Todas as informações devem estar preenchidas!');

  if (user.role !== 'admin')
    throw new Error(
      'Somente usuários administradores podem realizar esta ação!'
    );
}

export function updateAwardValidation(body: any) {
  const { id, description, value, medal, trophy, others } = body;
  if (
    !id ||
    !description ||
    value === null ||
    value === undefined ||
    medal === null ||
    medal === undefined ||
    trophy === null ||
    trophy === undefined ||
    !others
  )
    throw new Error('Todas as informações devem estar preenchidas!');
}

export function deleteAwardValidation(id: number) {
  if (!id) throw new Error('Insirá o ID');
}

export function getNotificationValidation(userID: number) {
  if (!userID) throw new Error('Id de usuário não pode ser nulo');
}

export function createNotificationValidation(
  type: string,
  user_id: number,
  gamer_id: number
) {
  if (!type || !user_id || !gamer_id)
    throw new Error('Todas as informações são obrigatórias');
}

export function editNotificationValidation(body: any) {
  const { ids, read } = body;
  if (ids.length <= 0 || read === null || read === undefined)
    throw new Error('Todas as informações precisam estar preenchidas!');
}

export function createChampionchipValidation(
  championshipData: Championship,
  user: { id: number; role: string }
) {
  const { name, startDate, endDate } = championshipData;
  if (user.role !== 'admin')
    throw new Error('Somente usuários administradores podem criar campeonatos');
  if (!name || !startDate || !endDate)
    throw new Error('Todos os dados devem ser preenchidos!');
}

export function editChampionshipValidation(name: string) {
  if (!name) throw new Error('Todos os campos devem estar preenchidos!');
}

export function deleteChampionshipValidation(id: number) {
  if (!id)
    throw new Error('Necessário inserir o ID para poder realizar a exclusão!');
}

export function createMatchValidation(
  body: Match,
  user: { id: number; role: string }
) {
  const { team1, team2, championship, status } = body;
  if (user.role !== 'admin') throw new Error('Usuário sem permissão');
  if (!team1 || !team2 || !championship || !status)
    throw new Error('Algumas informações obrigatórias estão faltando!');
}

export function updateMatchValidation(
  id: number,
  user: { id: number; role: string }
) {
  if (user.role !== 'admin') throw new Error('Usuário sem permissão');
  if (!id) throw new Error('Id não informado!');
}

export function deleteMatchValidation(
  id: number,
  user: { id: number; role: string }
) {
  if (!id || !user)
    throw new Error('ID e usuário é obrigatório para essa requisição!');
}

export function createMetricValidation(
  body: Metric,
  user: { id: number; role: string }
) {
  const { quantity, type, description, match, gamer } = body;
  if (!quantity || !type || !description || !match || !gamer)
    throw new Error('Todas as informações devem estar preenchidas!');
  if (user.role !== 'admin')
    throw new Error(
      'Somente usuários administradores podem registrar metricas!'
    );
}

export function updateTeamValidation(body: Team) {
  const { id, name } = body;
  if (!id || !name) throw new Error('Informações obrigatórias faltando!');
}
