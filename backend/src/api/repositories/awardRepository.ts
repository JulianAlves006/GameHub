import { AppDataSource } from '../../data-source.ts';
import { Award } from '../entities/index.ts';

const awardsRepository = AppDataSource.getRepository(Award);

export async function getAwards() {
  const awards = awardsRepository.find({
    relations: {
      awardsChampionships: { award: true },
    },
  });
  return awards;
}

export async function getAwardByID(id: number) {
  const awards = awardsRepository.find({
    relations: {
      awardsChampionships: { award: true },
    },
    where: {
      admin: { id: id },
    },
  });
  return awards;
}

export async function createAward(award: Award): Promise<Award> {
  const newAward = awardsRepository.create(award);
  await awardsRepository.save(newAward);
  return newAward;
}

export async function updateAward(
  body: Award,
  user: { id: number; role: string }
) {
  const { id, description, value, medal, trophy, others } = body;

  const award = await awardsRepository.findOne({
    where: { id: id },
    relations: {
      admin: true,
    },
  });
  if (!award) throw new Error('Premio não encontrado!');
  if (award.admin.id !== user.id)
    throw new Error('Este usuário não pode editar esse premio!');
  if (user.role !== 'admin')
    throw new Error('Este usuário não pode realizar esta ação! ');

  const newAward = {
    description,
    value,
    medal,
    trophy,
    others,
    admin: { id: user.id },
  };

  await awardsRepository
    .createQueryBuilder()
    .update(Award)
    .set(newAward)
    .where('id = :id', { id })
    .execute();

  return 'Premio editado com sucesso!';
}

export async function deleteAward(
  id: number,
  user: { id: number; role: string }
) {
  const award = await awardsRepository.findOne({
    where: { id: id },
    relations: {
      admin: true,
    },
  });
  if (!award) throw new Error('Premio não encontrado!');
  if (award.admin.id !== user.id)
    throw new Error('Este usuário não pode editar esse premio!');
  if (user.role !== 'admin')
    throw new Error('Este usuário não pode realizar esta ação! ');

  await awardsRepository
    .createQueryBuilder()
    .delete()
    .from(Award)
    .where('id = :id', { id: id })
    .execute();

  return { text: 'Premio deletado com sucesso!', award };
}
