import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';

import icon from '../../assets/icon.png';
import logo from '../../assets/logo.png';

import { Nav, UserInfo, Links } from './styled';
import { Center } from '../../style';
import { useEffect, useState } from 'react';
import api from '../../services/axios';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';
import { toastConfirm } from '../Notification';
import { markNotificationsAsRead } from '../../services/utils';

export default function Header() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserData();
    getNotifications();
  }, []);

  async function getUserData() {
    setLoading(true);
    try {
      const { data } = await api.get(`/user?id=${user.id}`);
      localStorage.setItem('user', JSON.stringify(data[0]));
      if (data[0].gamers[0].team) setTeam(data[0].gamers[0].team);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
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
          console.log(d);
          toastConfirm(
            `Jogador ${d?.gamer?.user?.name} quer entrar no seu time. Aceita?`,
            d?.type,
            'Não?',
            () =>
              handleAcceptNotification(
                d?.gamer,
                d?.user?.gamers?.[0]?.id,
                d?.team?.id
              ),
            () =>
              handleDeclineNotification(
                d?.gamer?.user?.id,
                d?.user?.gamers?.[0]?.id
              )
          );
        } else {
          toastConfirm(
            d.description,
            d?.type,
            '',
            () =>
              handleAcceptNotification(d?.gamer, d?.user?.gamers?.[0]?.id, 0),
            () =>
              handleDeclineNotification(
                d?.gamer?.user?.id,
                d?.user?.gamers?.[0]?.id
              )
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

  async function handleAcceptNotification(
    user: any,
    gamer_id: number,
    team: number
  ) {
    console.log(user);
    setLoading(true);
    try {
      await api.put('/gamer', {
        id: user.id,
        team,
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
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclineNotification(user_id: number, gamer_id: number) {
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

  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Nav>
        <img
          onClick={e => {
            e.preventDefault();
            navigate('/home');
          }}
          src={icon}
          className='icon'
        />
        <img
          onClick={e => {
            e.preventDefault();
            navigate('/home');
          }}
          src={logo}
          className='logo'
        />
        <Center>
          <Links>
            <h3>
              <Link to={'/home'}>Rankings</Link>
            </h3>
            <h3>
              <Link to={'/matches'}>Partidas</Link>
            </h3>
            <h3>
              <Link to={'/championships'}>Campeonatos</Link>
            </h3>
            {user?.gamers?.[0]?.score >= 50000 && !team && (
              <h3>
                <Link to={`/team`}>Criar time</Link>
              </h3>
            )}
          </Links>
        </Center>
        {user && (
          <UserInfo>
            {team && (team as any).logo && (
              <img
                onClick={e => {
                  e.preventDefault();
                  navigate(`/team/${team.id}`);
                }}
                src={`http://localhost:3333/team/${(team as any).id}/logo`}
                alt={`${(team as any).name} logo`}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <Link className='userLink' to={'/user'}>
              <h3>
                {user?.name}
                <FaUserAlt style={{ marginLeft: '8px' }} size={25} />
              </h3>
            </Link>
          </UserInfo>
        )}
      </Nav>
    </>
  );
}
