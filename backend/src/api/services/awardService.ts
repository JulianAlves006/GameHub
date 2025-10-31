import { AppDataSource } from '../../data-source.ts';
import { Award } from '../entities/Award.ts';
import { createLog } from '../../utils.ts';

const awardsRepository = AppDataSource.getRepository(Award);

export async function getAwards(id: number) {
  if (id) {
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
  const awards = awardsRepository.find({
    relations: {
      awardsChampionships: { award: true },
    },
  });
  return awards;
}

export async function createAward(
  body: Award,
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

  const award = {
    description,
    value,
    medal,
    trophy,
    others,
    admin: { id: user.id },
  };

  const newAward = awardsRepository.create(award);
  await awardsRepository.save(newAward);
  await createLog(
    user.id,
    'CREATE_AWARD',
    `Prêmio criado: ${description} (ID: ${newAward.id})`
  );
  return newAward;
}

export async function updateAward(
  body: Award,
  user: { id: number; role: string }
) {
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

  await createLog(
    user.id,
    'UPDATE_AWARD',
    `Prêmio editado: ${description} (ID: ${id})`
  );
  return 'Premio editado com sucesso!';
}

export async function deleteAward(
  id: number,
  user: { id: number; role: string }
) {
  if (!id) throw new Error('Insirá o ID');
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

  await createLog(
    user.id,
    'DELETE_AWARD',
    `Prêmio deletado: ${award.description} (ID: ${id})`
  );
  return 'Premio deletado com sucesso!';
}
