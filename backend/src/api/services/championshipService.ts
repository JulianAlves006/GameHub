import { AppDataSource } from '../../data-source.ts';
import { Championship } from '../entities/Championship.ts';
import { Award } from '../entities/Award.ts';
import { AwardsChampionship } from '../entities/AwardsChampionship.ts';
import { Match } from '../entities/Match.ts';

const awardsRepository = AppDataSource.getRepository(Award);

export async function getChampionship(idChampionship: number, idAdmin: number) {
  if (idChampionship && !idAdmin) {
    const championshipRepository = AppDataSource.getRepository(Championship);
    const championship = await championshipRepository.find({
      relations: {
        admin: true,
        matches: { team1: true, team2: true, winner: true },
        awardsChampionships: { award: true },
      },
      where: {
        id: idChampionship,
      },
    });

    return championship;
  }
  if (idAdmin && !idChampionship) {
    const championshipRepository = AppDataSource.getRepository(Championship);
    const championship = await championshipRepository.find({
      relations: {
        admin: true,
        matches: { team1: true, team2: true, winner: true, championship: true },
        awardsChampionships: { award: true },
      },
      where: {
        admin: { id: idAdmin },
      },
    });

    return championship;
  }
  if (idAdmin && idChampionship) {
    const championshipRepository = AppDataSource.getRepository(Championship);
    const championship = await championshipRepository.find({
      relations: {
        admin: true,
        matches: { team1: true, team2: true, winner: true },
        awardsChampionships: { award: true },
      },
      where: {
        id: idChampionship,
        admin: { id: idAdmin },
      },
    });

    return championship;
  }
  const championshipRepository = AppDataSource.getRepository(Championship);
  const championship = await championshipRepository.find({
    relations: {
      admin: true,
      matches: true,
      awardsChampionships: { award: true },
    },
  });

  return championship;
}

export async function createChampionchip(
  championshipData: Championship,
  awards: Award[],
  user: { id: number; role: string }
) {
  const { name, startDate, endDate } = championshipData;
  if (user.role !== 'admin')
    throw new Error('Somente usuários administradores podem criar campeonatos');
  if (!name || !startDate || !endDate)
    throw new Error('Todos os dados devem ser preenchidos!');

  //Verificações e validações do campeonato
  const championshipRepository = AppDataSource.getRepository(Championship);
  const existChampionship = await championshipRepository.findBy({ name: name });
  if (existChampionship.length > 0)
    throw new Error(
      'Já existe um torneio com este nome! Verifique se o cadastro já não foi realizado.'
    );
  const championship = {
    name,
    startDate,
    endDate,
    admin: { id: user.id } as any,
  };

  //Verificações e validações dos premios
  for (const award of awards) {
    const result = await awardsRepository.findBy({ id: award });
    if (result.length === 0)
      throw new Error(`Prêmio com ID ${award} não encontrado!`);
  }

  const newChampionship = championshipRepository.create(championship);
  const response = await championshipRepository.save(newChampionship);

  //Verificações e validações para criação dos campeonatos e premios
  const awardsChampionshipRepository =
    AppDataSource.getRepository(AwardsChampionship);

  for (let i = 0; i < awards.length; i++) {
    const awardChampionship = {
      award: awards[i],
      championship: response.id,
    };
    const newAwardChampionship =
      awardsChampionshipRepository.create(awardChampionship);
    await awardsChampionshipRepository.save(newAwardChampionship);
  }

  return newChampionship;
}

export async function editChampionship(
  championshipData: Championship,
  awards: AwardsChampionship[],
  user: { id: number; role: string }
) {
  const { id, name } = championshipData;
  if (!name) throw new Error('Todos os campos devem estar preenchidos!');

  const championshipRepository = AppDataSource.getRepository(Championship);
  const championship = await championshipRepository.findOne({
    where: { id: id },
    relations: {
      admin: true,
      matches: true,
      awardsChampionships: { award: true }, // aninhe se precisar
    },
  });
  if (!championship) throw new Error('Campeonato não encontrado!');
  if (championship.admin.id !== user.id)
    throw new Error('Este usuário não pode editar esse campeonato');

  //Verificações e validações dos premios
  for (const award of awards) {
    const result = await awardsRepository.findBy({ id: award.award });
    if (result.length === 0)
      throw new Error(`Prêmio com ID ${award.award} não encontrado!`);
  }

  //Verificações e validações para criação dos campeonatos e premios
  const awardsChampionshipRepository =
    AppDataSource.getRepository(AwardsChampionship);

  for (let i = 0; i < awards.length; i++) {
    if (awards[i]?.id) {
      const find = await awardsChampionshipRepository.findOneBy({
        id: awards[i].id,
      });
      if (!find) {
        throw new Error('ID não encontrado');
      }
      await awardsChampionshipRepository
        .createQueryBuilder()
        .update(AwardsChampionship)
        .set({ award: { id: awards[i]?.award } as any })
        .where('id = :id', { id: awards[i]?.id })
        .execute();
    } else {
      const awardChampionship = {
        award: { id: awards[i]?.award } as any,
        championship: id,
      };
      const newAwardChampionship =
        awardsChampionshipRepository.create(awardChampionship);
      await awardsChampionshipRepository.save(newAwardChampionship);
    }
  }

  await championshipRepository
    .createQueryBuilder()
    .update(Championship)
    .set({ name })
    .where('id = :id', { id })
    .execute();
  return 'Edição realizada com sucesso!';
}

export async function deleteChampionship(
  id: number,
  user: { id: number; role: string }
) {
  if (!id)
    throw new Error('Necessário inserir o ID para poder realizar a exclusão!');
  const championshipRepository = AppDataSource.getRepository(Championship);
  const championship = await championshipRepository.findOne({
    where: { id: id },
    relations: {
      admin: true,
    },
  });
  if (!championship) throw new Error('Campeonato não encontrado');
  if (championship.admin.id !== user.id)
    throw new Error('Este usuário não pode editar esse campeonato');

  const response = await AppDataSource.transaction(async manager => {
    const matches = await manager.find(Match, {
      where: { championship: { id } },
    });

    const playing = matches.find(m => m.status === 'playing');
    if (playing) {
      throw new Error(
        `Não é possível excluir o campeonato. A partida ${playing.id} ainda está em jogo.`
      );
    }

    await manager.delete(AwardsChampionship, { championship: { id } });

    await manager.delete(Match, { championship: { id } });

    await manager.delete(Championship, { id });
  });

  return 'Campeonato deletado com sucesso!';
}
