import { AppDataSource } from '../../data-source.ts';
import { Gamer } from '../entities/Gamer.ts';
import { Team } from '../entities/Team.ts';

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
  const gamersWithId = await gamerRepository.find({
    where: { user: { id: user } },
  });
  if (gamersWithId.length > 0)
    throw new Error('Este usuário já possui um jogador.');

  if (team) {
    const gamer = {
      shirtNumber,
      user,
      team,
    };
    const newGamer = gamerRepository.create(gamer);
    await gamerRepository.save(newGamer);
    return newGamer;
  }

  const gamer = {
    shirtNumber,
    user,
  };
  const newGamer = gamerRepository.create(gamer);
  await gamerRepository.save(newGamer);
  return newGamer;
}

export async function updateGamer(body: Gamer) {
  const { id, shirtNumber, team } = body;

  if (!id) throw new Error('ID precisa estar preenchido para a edição');

  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
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

  if (team) {
    const newGamer = {
      team,
      shirtNumber,
    };
    await gamerRepository
      .createQueryBuilder()
      .update(Gamer)
      .set(newGamer)
      .where('id = :id', { id: id })
      .execute();
  }

  await gamerRepository
    .createQueryBuilder()
    .update(Gamer)
    .set({ shirtNumber })
    .where('id = :id', { id: id })
    .execute();

  return 'Gamer editado com sucesso!';
}

export async function deleteGamer(id: number) {
  if (!id) throw new Error('Id está vazio!');
  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
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

  await gamerRepository
    .createQueryBuilder()
    .delete()
    .from(Gamer)
    .where('id = :id', { id: id })
    .execute();
  return `Gamer deletado com sucesso`;
}
