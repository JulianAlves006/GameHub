import { AppDataSource } from '../../data-source.ts';
import { Notifications } from '../entities/Notifications.ts';
import type { User } from '../entities/User.ts';
import { createLog } from '../../utils.ts';

const notificationRepository = AppDataSource.getRepository(Notifications);

export async function getNotifications(userID: User['id']) {
  if (!userID) throw new Error('Id de usuário não pode ser nulo');

  return await notificationRepository.find({
    where: { user: { id: userID } },
    relations: { gamer: { user: true }, user: { gamers: true }, team: true },
  });
}

export async function createNotifications(
  type: string,
  user_id: number,
  gamer_id: number,
  description: string,
  teamID: number | null
) {
  if (!type || !user_id || !gamer_id)
    throw new Error('Todas as informações são obrigatórias');

  const notification: any = {
    type,
    description,
    read: 0,
    user: { id: user_id },
    gamer: { id: gamer_id },
  };

  if (teamID != null) {
    notification.team = { id: teamID };
  }

  const newnotification = notificationRepository.create(notification);
  await notificationRepository.save(newnotification);
  await createLog(
    user_id,
    'CREATE_NOTIFICATION',
    `Notificação criada: ${type} para usuário ${user_id} (ID: ${newnotification.id})`
  );
  return newnotification;
}

export async function editNotifications(
  body: { ids: number[]; read: number },
  user: { id: number }
) {
  const { ids, read } = body;
  if (ids.length <= 0 || read === null || read === undefined)
    throw new Error('Todas as informações precisam estar preenchidas!');

  for (const id of ids) {
    const notification = await notificationRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!notification) throw new Error('Notificação não encontrada!');
    if (notification.user.id !== user.id)
      throw new Error('Este usuário não pode realizar esta ação!');

    await notificationRepository
      .createQueryBuilder()
      .update(Notifications)
      .set({ read })
      .where('id = :id', { id })
      .execute();
  }

  await createLog(
    user.id,
    'UPDATE_NOTIFICATION',
    `${ids.length} notificação(ões) marcada(s) como ${read === 1 ? 'lida(s)' : 'não lida(s)'}`
  );
  return 'Notificações editadas com sucesso!';
}
