import { Log, User } from '../../api/entities/index.ts';
import { AppDataSource } from '../../data-source.ts';

const logRepository = AppDataSource.getRepository(Log);

export async function createLog(
  user_id: number,
  action: string,
  description: string
) {
  if (!user_id || !action || !description)
    throw new Error('Todas as informações precisam estar preenchidas no log!');

  const log = logRepository.create({
    user: { id: user_id } as User,
    action,
    description,
  });

  await logRepository.save(log);
}
