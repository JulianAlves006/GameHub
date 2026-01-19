import { toast } from 'react-toastify';
import { toastConfirm } from '../components/Notification';
import api from '../services/axios';

interface NotificationsProps {
  setLoading: (value: boolean) => void;
}

async function markNotificationsAsRead(ids: number[]) {
  if (!ids.length) return;
  try {
    await api.put('/notifications', {
      ids,
      read: true,
    });
  } catch (error: any) {
    toast.error(
      error?.response?.data?.error || 'Falha ao marcar notificações como lidas'
    );
  }
}

export function useNotifications({ setLoading }: NotificationsProps) {
  async function createNotifications(
    type: string,
    user_id: number,
    gamer_id: number,
    description: string,
    teamID: number
  ) {
    if (!type || !user_id || !gamer_id) {
      toast.error('Todas as informações devem ser preenchidas!');
      return;
    }
    try {
      await api.post('/notifications', {
        type,
        user_id,
        gamer_id,
        description,
        teamID,
      });
      toast.success('Notificação enviada com sucesso!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          'Falha ao marcar notificações como lidas'
      );
    }
  }

  async function getNotifications() {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');

      // pegue apenas as que estão não lidas AGORA
      const unread = (data || []).filter((d: any) => !d.read);
      const unreadIds = unread.map((d: any) => d.id);

      if (unreadIds.length) {
        await markNotificationsAsRead(unreadIds);
      }

      unread.forEach((d: any) => {
        if (d.type === 'team_accept') {
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} quer entrar no seu time. Aceita?`,
            d?.type,
            'Não?',
            () =>
              handleAcceptGamer(
                d?.gamer,
                d?.user?.gamers?.[0]?.id,
                d?.team?.id,
                d?.gamer?.user?.id
              ),
            () =>
              handleDeclineGamer(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        } else if (d.type === 'team_leave') {
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} quer sair do seu time. Aceita?`,
            d?.type,
            'Não?',
            () => handleAcceptLeave(d?.gamer, d?.user?.gamers?.[0]?.id),
            () =>
              handleDeclineLeave(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        } else if (d.type === 'team_invite') {
          console.log('DATA CONBSOLE S:A', d);
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} responsável pelo time ${d?.team?.name} quer que você entre no time dele. Aceita?`,
            d?.type,
            'Não?',
            () =>
              handleAcceptGamer(
                d?.user?.gamers?.[0],
                d?.gamer.id,
                d?.team?.id,
                d?.gamer?.user?.id
              ),
            () =>
              handleDeclineGamer(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        } else {
          toastConfirm(
            d.description,
            d?.type,
            '',
            () =>
              handleAcceptGamer(
                d?.gamer,
                d?.user?.gamers?.[0]?.id,
                0,
                d?.gamer?.user?.id
              ),
            () =>
              handleDeclineGamer(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        }
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || 'Erro ao buscar notificações'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptGamer(
    gamer: any,
    gamer_id: number,
    team: number,
    user_id: number
  ) {
    setLoading(true);
    try {
      await api.put('/gamer', {
        id: gamer.id,
        team,
      });

      await api.post('/notifications', {
        type: 'accept',
        user_id,
        gamer_id,
        description: 'Sua solicitação foi aceita!',
        team: null,
      });
      toast.success('Aceito com sucesso!');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclineGamer(user_id: number, gamer_id: number) {
    try {
      await api.post('/notifications', {
        type: 'decline',
        user_id,
        gamer_id,
        description: 'Sua solicitação foi recusada!',
      });
      toast.success('Recusado com sucesso!');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptLeave(user: any, gamer_id: number) {
    setLoading(true);
    try {
      await api.put('/gamer', {
        id: user.id,
        team: null,
      });

      await api.post('/notifications', {
        type: 'accept',
        user_id: user.user?.id,
        gamer_id,
        description: 'Sua solicitação foi aceita!',
        team: null,
      });
      toast.success('Aceito com sucesso!');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclineLeave(user_id: number, gamer_id: number) {
    try {
      await api.post('/notifications', {
        type: 'decline',
        user_id,
        gamer_id,
        description: 'Sua solicitação foi recusada!',
      });
      toast.success('Recusado com sucesso!');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return { getNotifications, createNotifications };
}
