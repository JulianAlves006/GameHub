import { error } from 'console';
import { AppDataSource } from '../../data-source.ts';
import { AwardsChampionship } from '../entities/AwardsChampionship.ts';

const awardsChampionshipRepository =
  AppDataSource.getRepository(AwardsChampionship);

export async function getAwardChampionship(
  idAward: number,
  idChampionship: number
) {
  if (idAward && !idChampionship) {
    const response = await awardsChampionshipRepository.find({
      relations: {
        championship: true,
      },
      where: {
        award: { id: idAward },
      },
    });
    return response;
  }
  if (idChampionship && !idAward) {
    const response = await awardsChampionshipRepository.find({
      relations: {
        award: true,
      },
      where: {
        championship: { id: idChampionship },
      },
    });
    return response;
  }
  if (idChampionship && idAward) {
    const response = await awardsChampionshipRepository.find({
      relations: {
        award: true,
        championship: true,
      },
      where: {
        championship: { id: idChampionship },
        award: { id: idAward },
      },
    });
    return response;
  }
}

export async function deleteAwardChampionship(
  ids: number[],
  user: { id: number; role: string }
) {
  if (!ids || ids.length === 0)
    throw new Error('IDs são obrigatórios para a requisição');
  if (user.role !== 'admin')
    throw new Error('Este usuário não pode realizar esta ação');

  for (const id of ids) {
    const result = await awardsChampionshipRepository
      .createQueryBuilder('ac')
      .leftJoinAndSelect('ac.award', 'award')
      .leftJoinAndSelect('ac.championship', 'championship')
      .leftJoinAndSelect('championship.admin', 'admin')
      .where('ac.id = :id', { id })
      .getOne();

    if (!result) throw new Error('ID não encontrado');

    if (result?.championship.admin.id !== user.id)
      throw new Error('Este usuário não pode realizar esta ação');

    await awardsChampionshipRepository
      .createQueryBuilder()
      .delete()
      .from(AwardsChampionship)
      .where('id = :id', { id })
      .execute();
  }

  return 'Deletado com sucesso!';
}
