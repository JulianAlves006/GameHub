import { AppDataSource } from '../../data-source.ts';
import {
  Award,
  AwardsChampionship,
  Championship,
  Match,
} from '../entities/index.ts';

const awardsRepository = AppDataSource.getRepository(Award);

export async function getChampionship(
  idChampionship: number | undefined,
  idAdmin: number | undefined,
  page: number = 1,
  limit: number = 10
) {
  const championshipRepository = AppDataSource.getRepository(Championship);
  const skip = (page - 1) * limit;

  // Se há idChampionship específico, retorna sem paginação (busca única)
  if (idChampionship && !idAdmin) {
    const championship = await championshipRepository.find({
      relations: {
        admin: true,
        matches: { team1: true, team2: true, championship: true },
        awardsChampionships: { award: true },
      },
      where: {
        id: idChampionship,
      },
    });

    return championship;
  }

  // Se há idAdmin e idChampionship, retorna sem paginação (busca única)
  if (idAdmin && idChampionship) {
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

  // Para buscas múltiplas, usar QueryBuilder e aplicar paginação
  let championshipsQuery = championshipRepository
    .createQueryBuilder('championship')
    .leftJoinAndSelect('championship.admin', 'admin')
    .leftJoinAndSelect('championship.matches', 'matches')
    .leftJoinAndSelect('matches.team1', 'team1')
    .leftJoinAndSelect('matches.team2', 'team2')
    .leftJoinAndSelect('matches.winner', 'winner')
    .leftJoinAndSelect('matches.championship', 'matchChampionship')
    .leftJoinAndSelect(
      'championship.awardsChampionships',
      'awardsChampionships'
    )
    .leftJoinAndSelect('awardsChampionships.award', 'award');

  // Aplicar filtro por admin se fornecido
  if (idAdmin && !idChampionship) {
    championshipsQuery = championshipsQuery.where('admin.id = :idAdmin', {
      idAdmin,
    });
  }

  // Buscar todos os campeonatos (antes da paginação para contar total)
  const allChampionships = await championshipsQuery.getMany();

  // Aplicar paginação
  const totalCount = allChampionships.length;
  const championships = allChampionships.slice(skip, skip + limit);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    championships,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      limit,
    },
  };
}

export async function createChampionchip(
  championshipData: Championship,
  awards: Award[],
  user: { id: number; role: string }
) {
  const { name, startDate, endDate } = championshipData;
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
    if (!award || !award.id) {
      throw new Error('Prêmio inválido!');
    }
    const result = await awardsRepository.findBy({ id: award.id });
    if (result.length === 0)
      throw new Error(`Prêmio com ID ${award.id} não encontrado!`);
  }

  const newChampionship = championshipRepository.create(championship);
  const response = await championshipRepository.save(newChampionship);

  //Verificações e validações para criação dos campeonatos e premios
  const awardsChampionshipRepository =
    AppDataSource.getRepository(AwardsChampionship);

  for (let i = 0; i < awards.length; i++) {
    const award = awards[i];
    if (!award || !award.id) {
      throw new Error(`Prêmio inválido no índice ${i}`);
    }
    const awardChampionship = {
      award: { id: award.id },
      championship: { id: response.id },
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
    // award.award pode ser um número (ID) ou um objeto Award
    const awardId =
      typeof award.award === 'number' ? award.award : (award.award?.id ?? null);
    if (!awardId) {
      throw new Error('ID do prêmio inválido!');
    }
    const result = await awardsRepository.findBy({ id: awardId });
    if (result.length === 0)
      throw new Error(`Prêmio com ID ${awardId} não encontrado!`);
  }

  //Verificações e validações para criação dos campeonatos e premios
  const awardsChampionshipRepository =
    AppDataSource.getRepository(AwardsChampionship);

  for (let i = 0; i < awards.length; i++) {
    const awardId = awards[i]?.id;
    if (awardId) {
      const find = await awardsChampionshipRepository.findOneBy({
        id: awardId,
      });
      if (!find) {
        throw new Error('ID não encontrado');
      }
      await awardsChampionshipRepository
        .createQueryBuilder()
        .update(AwardsChampionship)
        .set({ award: { id: awards[i]?.award } as any })
        .where('id = :id', { id: awardId })
        .execute();
    } else {
      // award.award pode ser um número (ID) ou um objeto Award
      const awardIdForCreate =
        typeof awards[i]?.award === 'number'
          ? awards[i]?.award
          : (awards[i]?.award?.id ?? null);
      if (!awardIdForCreate || typeof awardIdForCreate !== 'number') {
        throw new Error('ID do prêmio inválido para criação!');
      }
      const awardChampionship = {
        award: { id: awardIdForCreate as number },
        championship: { id: id },
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

  return { text: 'Campeonato deletado com sucesso!', championship };
}
