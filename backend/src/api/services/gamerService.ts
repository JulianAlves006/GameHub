import { AppDataSource } from '../../data-source.ts';
import { Gamer } from '../entities/Gamer.ts';
import { Team } from '../entities/Team.ts';
import { createLog } from '../../utils.ts';

const gamerRepository = AppDataSource.getRepository(Gamer);

export async function getGamers() {
  const gamers = await gamerRepository.find();
  return gamers;
}

export async function createGamer(body: Gamer) {
  const { shirtNumber, user, team } = body;

  if (!shirtNumber || !user)
    throw new Error(
      'As informações obrigatórias devem estar preenchidas. (shirtNumber && user)'
    );

  // Extrair ID do usuário se for um objeto
  const userId =
    typeof user === 'object' && user !== null && 'id' in user ? user.id : user;

  const gamersWithId = await gamerRepository.find({
    where: { user: { id: userId } },
  });
  if (gamersWithId.length > 0)
    throw new Error('Este usuário já possui um jogador.');

  if (team) {
    const teamId =
      typeof team === 'object' && team !== null && 'id' in team
        ? team.id
        : team;
    const gamer = {
      shirtNumber,
      user: { id: userId },
      team: { id: teamId },
    };
    const newGamer = gamerRepository.create(gamer);
    await gamerRepository.save(newGamer);
    await createLog(
      userId,
      'CREATE_GAMER',
      `Gamer criado: número ${shirtNumber} (ID: ${newGamer.id})`
    );
    return newGamer;
  }

  const gamer = {
    shirtNumber,
    user: { id: userId },
  };
  const newGamer = gamerRepository.create(gamer);
  await gamerRepository.save(newGamer);
  await createLog(
    userId,
    'CREATE_GAMER',
    `Gamer criado: número ${shirtNumber} (ID: ${newGamer.id})`
  );
  return newGamer;
}

export async function updateGamer(body: Gamer) {
  const { id, shirtNumber, team, score } = body;

  if (!id) throw new Error('ID precisa estar preenchido para a edição');

  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
      user: true,
    },
  });

  if (!gamer) throw new Error('Gamer não encontrado');
  if (gamer.team) {
    const teamData = await AppDataSource.getRepository(Team).findOne({
      where: { id: gamer.team.id },
      relations: {
        matchesAsTeam1: true,
        matchesAsTeam2: true,
      },
    });
    if (teamData?.matchesAsTeam1.some(match => match.status === 'playing'))
      throw new Error(
        'Gamer está em uma partida, portanto por enquanto não pode ser editado!'
      );
    if (teamData?.matchesAsTeam2.some(match => match.status === 'playing'))
      throw new Error(
        'Gamer está em uma partida, portanto por enquanto não pode ser editado!'
      );
  }

  const updateData: any = {};

  if (team) {
    const teamId =
      typeof team === 'object' && team !== null && 'id' in team
        ? team.id
        : team;
    updateData.team = { id: teamId };
  }

  if (shirtNumber !== undefined) {
    updateData.shirtNumber = shirtNumber;
  }

  if (score !== undefined && score !== null) {
    const newScore = gamer.score + score;
    updateData.score = newScore;
  }

  if (Object.keys(updateData).length > 0) {
    await gamerRepository
      .createQueryBuilder()
      .update(Gamer)
      .set(updateData)
      .where('id = :id', { id: id })
      .execute();
  }

  // Usar o shirtNumber do gamer se não foi passado no body
  const finalShirtNumber =
    shirtNumber !== undefined ? shirtNumber : gamer.shirtNumber;
  const scoreInfo =
    score !== undefined && score !== null ? `, score atualizado` : '';

  // Verificar se o usuário existe antes de criar o log
  if (!gamer.user || !gamer.user.id) {
    throw new Error('Usuário associado ao gamer não encontrado');
  }

  await createLog(
    gamer.user.id,
    'UPDATE_GAMER',
    `Gamer editado: número ${finalShirtNumber}${scoreInfo} (ID: ${id})`
  );
  return 'Gamer editado com sucesso!';
}

export async function deleteGamer(id: number) {
  if (!id) throw new Error('Id está vazio!');
  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
      user: true,
    },
  });

  if (!gamer) throw new Error('Gamer não encontrado!');

  const teamData = await AppDataSource.getRepository(Team).findOne({
    where: { id: gamer.team.id },
    relations: {
      matchesAsTeam1: true,
      matchesAsTeam2: true,
    },
  });
  if (teamData?.matchesAsTeam1.some(match => match.status === 'playing'))
    throw new Error(
      'Gamer está em uma partida, portanto por enquanto não pode ser deletado!'
    );
  if (teamData?.matchesAsTeam2.some(match => match.status === 'playing'))
    throw new Error(
      'Gamer está em uma partida, portanto por enquanto não pode ser deletado!'
    );

  const userId = gamer.user?.id || null;
  await gamerRepository
    .createQueryBuilder()
    .delete()
    .from(Gamer)
    .where('id = :id', { id: id })
    .execute();
  if (userId) {
    await createLog(userId, 'DELETE_GAMER', `Gamer deletado (ID: ${id})`);
  }
  return `Gamer deletado com sucesso`;
}
