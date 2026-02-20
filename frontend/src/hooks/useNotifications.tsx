import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { toastConfirm } from '../components/Notification';
import api from '../services/axios';
import type { Notification, Gamer } from '@/types/types';

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
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      toast.error(
        error.response?.data?.error || 'Falha ao marcar notificações como lidas'
      );
    } else {
      toast.error('Falha ao marcar notificações como lidas');
    }
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
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || 'Falha ao enviar notificação'
        );
      } else {
        toast.error('Falha ao enviar notificação');
      }
    }
  }

  async function getNotifications() {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');

      // pegue apenas as que estão não lidas AGORA
      const unread = (data || []).filter((d: Notification) => !d.read);
      const unreadIds = unread.map((d: Notification) => d.id);

      if (unreadIds.length) {
        await markNotificationsAsRead(unreadIds);
      }

      unread.forEach((d: Notification) => {
        if (d.type === 'team_accept') {
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} quer entrar no seu time. Aceita?`,
            d?.type,
            '',
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
            '',
            () => handleAcceptLeave(d?.gamer, d?.user?.gamers?.[0]?.id),
            () =>
              handleDeclineLeave(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        } else if (d.type === 'team_invite') {
          console.log('DATA CONBSOLE S:A', d);
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} responsável pelo time ${d?.team?.name} quer que você entre no time dele. Aceita?`,
            d?.type,
            '',
            () =>
              handleAcceptGamer(
                d?.user?.gamers?.[0],
                d?.gamer?.id,
                d?.team?.id,
                d?.gamer?.user?.id
              ),
            () =>
              handleDeclineGamer(d?.gamer?.user?.id, d?.user?.gamers?.[0]?.id)
          );
        } else {
          toastConfirm(
            d.description ?? '',
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
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || 'Erro ao buscar notificações'
        );
      } else {
        toast.error('Erro ao buscar notificações');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptGamer(
    gamer: Gamer | undefined,
    gamer_id: number | undefined,
    team: number | undefined,
    user_id: number | undefined
  ) {
    if (
      !gamer?.id ||
      gamer_id === undefined ||
      team === undefined ||
      user_id === undefined
    ) {
      toast.error('Dados insuficientes para aceitar jogador');
      return;
    }
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
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao aceitar jogador');
      } else {
        toast.error('Erro ao aceitar jogador');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclineGamer(
    user_id: number | undefined,
    gamer_id: number | undefined
  ) {
    if (user_id === undefined || gamer_id === undefined) {
      toast.error('Dados insuficientes para recusar jogador');
      return;
    }
    try {
      await api.post('/notifications', {
        type: 'decline',
        user_id,
        gamer_id,
        description: 'Sua solicitação foi recusada!',
      });
      toast.success('Recusado com sucesso!');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao recusar jogador');
      } else {
        toast.error('Erro ao recusar jogador');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptLeave(
    gamer: Gamer | undefined,
    gamer_id: number | undefined
  ) {
    if (!gamer?.id || !gamer?.user?.id || gamer_id === undefined) {
      toast.error('Dados insuficientes para aceitar saída');
      return;
    }
    setLoading(true);
    try {
      await api.put('/gamer', {
        id: gamer.id,
        team: null,
      });

      await api.post('/notifications', {
        type: 'accept',
        user_id: gamer.user.id,
        gamer_id,
        description: 'Sua solicitação foi aceita!',
        team: null,
      });
      toast.success('Aceito com sucesso!');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao aceitar saída');
      } else {
        toast.error('Erro ao aceitar saída');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclineLeave(
    user_id: number | undefined,
    gamer_id: number | undefined
  ) {
    if (user_id === undefined || gamer_id === undefined) {
      toast.error('Dados insuficientes para recusar saída');
      return;
    }
    try {
      await api.post('/notifications', {
        type: 'decline',
        user_id,
        gamer_id,
        description: 'Sua solicitação foi recusada!',
      });
      toast.success('Recusado com sucesso!');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao recusar saída');
      } else {
        toast.error('Erro ao recusar saída');
      }
    } finally {
      setLoading(false);
    }
  }

  return { getNotifications, createNotifications };
}
