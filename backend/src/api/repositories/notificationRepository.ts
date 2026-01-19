import { AppDataSource } from '../../data-source.ts';
import { Notifications, User } from '../entities/index.ts';

const notificationRepository = AppDataSource.getRepository(Notifications);

export async function getNotifications(userID: User['id']) {
  return await notificationRepository.find({
    where: { user: { id: userID } },
    relations: { gamer: { user: true }, user: { gamers: true }, team: true },
  });
}

export async function createNotification(
  type: string,
  user_id: number,
  gamer_id: number,
  description: string,
  teamID: number | null
): Promise<Notifications> {
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
  const savedNotification = await notificationRepository.save(newnotification);

  // TypeScript infere que save pode retornar Notifications | Notifications[], mas como passamos um único objeto, garantimos que é Notifications
  return (
    Array.isArray(savedNotification) ? savedNotification[0] : savedNotification
  ) as Notifications;
}

export async function editNotifications(
  body: { ids: number[]; read: number },
  user: { id: number }
) {
  const { ids, read } = body;
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

  return 'Notificações editadas com sucesso!';
}
