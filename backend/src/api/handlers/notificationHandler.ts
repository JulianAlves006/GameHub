import type { User } from '../entities/index.ts';
import { createLog } from '../repositories/logRepository.ts';
import {
  createNotification,
  editNotifications,
  getNotifications,
} from '../repositories/notificationRepository.ts';
import {
  createNotificationValidation,
  editNotificationValidation,
  getNotificationValidation,
} from '../validations/validations.ts';

export async function getNotificationHandler(userID: User['id']) {
  try {
    getNotificationValidation(userID);

    const response = await getNotifications(userID);

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getNotificationHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar notificações'
    );
  }
}

export async function createNotificationHandler(
  type: string,
  user_id: number,
  gamer_id: number,
  description: string,
  teamID: number | null
) {
  try {
    createNotificationValidation(type, user_id, gamer_id);
    const response = await createNotification(
      type,
      user_id,
      gamer_id,
      description,
      teamID
    );
    await createLog(
      user_id,
      'CREATE_NOTIFICATION',
      `Notificação criada: ${type} para usuário ${user_id} (ID: ${response.id})`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getNotificationHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar notificações'
    );
  }
}

export async function editNotificationHandler(
  body: { ids: number[]; read: number },
  user: { id: number }
) {
  try {
    const { ids, read } = body;
    editNotificationValidation(body);

    const response = await editNotifications(body, user);

    await createLog(
      user.id,
      'UPDATE_NOTIFICATION',
      `${ids.length} notificação(ões) marcada(s) como ${read === 1 ? 'lida(s)' : 'não lida(s)'}`
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getNotificationHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar notificações'
    );
  }
}
