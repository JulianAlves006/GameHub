import { useEffect, useState, useMemo } from 'react';
import { Card, Container, Left, Right, Title } from '../../style';
import { UserData, InfoCard, TeamInfo, InfoLabel, InfoValue } from './styled';
import api from '../../services/axios';
import { toast } from 'react-toastify';
import { Table } from '../../components/Table';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../components/loading';
import { FaEdit, FaWindowClose, FaCheck } from 'react-icons/fa';
import { isEmail } from 'validator';
import { formatMetricsForChart } from '../../services/utils';
import RadarChart from '../../components/RadarChart';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../contexts/AppContext';
import { type Team, type Championship, type Match } from '../../types/types';
export default function User() {
  const ctx = useApp();
  const { id } = useParams();
  const accessUser = ctx.user;
  const [user, setUser] = useState(ctx.user);
  const [matches, setMatches] = useState<
    {
      link: number | undefined;
      championship: string | undefined;
      championshipId: number | undefined;
      team1: string | undefined;
      team2: string | undefined;
      winner: string;
      status: string;
    }[]
  >([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { createNotifications } = useNotifications({ setLoading });

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [metrics, setMetrics] = useState<
    { type: string; quantity: number }[] | undefined
  >();
  const [canInviteToTeam, setCanInviteToTeam] = useState<{
    show: boolean;
    teamInfo: Team | null;
  }>({ show: false, teamInfo: null });

  const chartData = useMemo(() => {
    if (!metrics) {
      return formatMetricsForChart({
        metrics: {},
        label: user?.name || 'Meu Perfil',
      });
    }

    const result = formatMetricsForChart({
      metrics: metrics,
      label: user?.name || 'Meu Perfil',
    });

    return result;
  }, [metrics, user?.name]);

  function verifyHability(score: number) {
    if (score <= 9999) return 'Iniciante';
    if (score > 9999 && score <= 24999) return 'Mediano';
    if (score > 24999 && score <= 49999) return 'Experiente';
    if (score >= 50000) return 'Profissional';
  }

  const statusFront = {
    playing: 'Jogando',
    pending: 'Pendente',
    finished: 'Finalizada',
  };

  const configMatches = [
    {
      key: 'link',
      label: 'Partida',
      element: 'link',
      linkDirection: 'match',
    },
    {
      key: 'championship',
      label: 'Campeonato',
      element: 'link',
      content: true,
      linkContent: 'championshipId',
      linkDirection: 'championship',
    },
    {
      key: 'team1',
      label: 'Time 1',
      element: 'tr',
    },
    {
      key: 'team2',
      label: 'Time 2',
      element: 'tr',
    },
    {
      key: 'winner',
      label: 'Vencedor',
      element: 'tr',
    },
    {
      key: 'status',
      label: 'Status',
      element: 'tr',
    },
  ];

  //Verifica se é pra trazer os dados de um usuário aleatório ou do usuário que acessou o sistema
  useEffect(() => {
    if (id) {
      getUserData(Number(id));
    }
  }, [id]);

  // Atualiza name e email automaticamente quando user mudar
  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (user?.profile === 'admin') {
      getChampionships();
    } else {
      const gamerMetrics = user?.gamers?.[0]?.metrics;
      setMetrics(gamerMetrics);
      getMatches();
    }
  }, [user]);

  useEffect(() => {
    async function checkCanInvite() {
      const result = await verifyInviteTeamButtom();
      if (result.show) {
        setCanInviteToTeam(result);
      }
    }
    checkCanInvite();
  }, [user]);

  async function verifyInviteTeamButtom() {
    try {
      let userTeam;
      console.log(user);
      if (!user?.gamers?.[0]?.team) {
        userTeam = await api.get(`/team?idAdmin=${user?.gamers?.[0].id}`);
      }
      const accesUserTeam = await api.get(
        `/team?idAdmin=${accessUser?.gamers?.[0].id}`
      );

      console.log('userTeam', userTeam);
      console.log('accesUserTeam', accesUserTeam);

      if (
        userTeam?.data.teams.length > 0 &&
        accesUserTeam.data.teams.length > 0 &&
        accessUser?.profile === 'gamer'
      )
        return { show: true, teamInfo: accesUserTeam.data.teams[0] };

      return { show: false, teamInfo: null };
    } catch (error: any) {
      toast.error(error?.data?.response?.error || error);
      return { show: false, teamInfo: null };
    }
  }

  async function getUserData(id: number) {
    try {
      setLoading(true);
      const { data } = await api.get(`/user?id=${id}`);
      setUser(data[0]);
    } catch (error: any) {
      toast.error(error?.data?.response?.error || error);
    } finally {
      setLoading(false);
    }
  }

  async function getChampionships() {
    setLoading(true);
    try {
      const { data } = await api.get<Championship[]>(
        `/championship?idAdmin=${user?.id}`
      );
      setChampionships(data);
      const dataFormated = data.map(d => d.matches).flat();
      const frontData = dataFormated
        ?.filter(d => d?.status !== 'finished')
        .map(d => ({
          link: d?.id,
          championship: d?.championship?.name,
          championshipId: d?.championship?.id,
          team1: d?.team1?.name,
          team2: d?.team2?.name,
          winner: d?.winner?.name ?? 'Indefinido',
          status: statusFront[d?.status as keyof typeof statusFront],
        }));
      setMatches(frontData);
    } catch (error: any) {
      toast.error(error?.data?.response?.error || error);
    } finally {
      setLoading(false);
    }
  }

  async function getMatches() {
    setLoading(true);
    try {
      // Verifica se o gamer tem um time antes de buscar partidas
      if (!user?.gamers?.[0]?.team) {
        setMatches([]);
        return;
      }

      const { data } = await api.get<Match[]>(
        `match?idTeam=${user?.gamers?.[0]?.team.id}`
      );
      const frontData = data
        ?.filter(d => d.status !== 'finished')
        .map(d => ({
          link: d.id,
          championship: d.championship?.name,
          championshipId: d.championship?.id,
          team1: d.team1?.name,
          team2: d.team2?.name,
          winner: d?.winner?.name ?? 'Indefinido',
          status: statusFront[d.status as keyof typeof statusFront],
        }));
      setMatches(frontData);
      addUniqueChampionshipsFromTeam(data);
    } catch (error: any) {
      toast.error(error.data.response.error || error);
    } finally {
      setLoading(false);
    }
  }

  function addUniqueChampionshipsFromTeam(matches: any[]) {
    setChampionships(prev => {
      const seen = new Set(prev.map(c => c.id));
      const next = [...prev];

      for (const m of matches) {
        if (!seen.has(m.championship.id)) {
          seen.add(m.championship.id);
          next.push(m.championship);
        }
      }
      return next;
    });
  }

  async function handleEdit() {
    if (!isEmail(email) || !name) {
      toast.error('Nome ou email inválidos! Preencha tudo corretamente');
      return;
    }
    try {
      await api.put('/user', {
        id: user?.id,
        name,
        email,
      });
      toast.success('Usuário editado com sucesso!');
      setIsEditing(false);
      if (user) {
        ctx.setUser({
          ...user,
          name,
          email,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.response?.erro || 'Erro ao editar usuário');
    }
  }

  async function handleNotification() {
    console.log(canInviteToTeam.teamInfo);
    if (
      !user?.id ||
      !accessUser?.gamers?.[0]?.id ||
      !canInviteToTeam.teamInfo?.id
    )
      return;
    await createNotifications(
      'team_invite',
      user.id,
      accessUser.gamers[0].id,
      ``,
      canInviteToTeam.teamInfo.id
    );
  }

  return (
    <Container>
      {canInviteToTeam.show && (
        <Right>
          <button onClick={handleNotification}>
            Solicitar para jogador entrar no time
          </button>
        </Right>
      )}
      {user?.profile !== 'admin' && user?.id === accessUser?.id && (
        <>
          <Left>
            {isEditing ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '5%',
                  marginTop: '10px',
                  position: 'absolute',
                }}
              >
                <FaWindowClose
                  onClick={() => setIsEditing(false)}
                  color='red'
                  size={20}
                  style={{
                    cursor: 'pointer',
                  }}
                />
                <FaCheck
                  onClick={handleEdit}
                  color='green'
                  size={20}
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </div>
            ) : (
              <FaEdit
                onClick={() => setIsEditing(true)}
                style={{
                  marginTop: '10px',
                  position: 'absolute',
                  cursor: 'pointer',
                }}
                size={20}
              />
            )}
          </Left>
        </>
      )}
      {championships.length > 0 && user?.profile === 'admin' && (
        <Left>
          <Link style={{ marginTop: '10px' }} to={'/awards'}>
            Criar premios
          </Link>
        </Left>
      )}
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>
        {isEditing ? (
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        ) : (
          name
        )}
      </Title>
      <UserData>
        {user?.profile === 'admin' ? (
          <>
            <InfoCard>
              <li>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>
                  {isEditing ? (
                    <input
                      type='text'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  ) : (
                    email
                  )}
                </InfoValue>
              </li>
            </InfoCard>
            <h1>Campeonatos</h1>
            <Card
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                padding: '20px',
              }}
            >
              {championships.map(c => (
                <Link
                  key={c.id}
                  to={`/championship/${c.id}`}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(108, 99, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(108, 99, 255, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      'rgba(108, 99, 255, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background =
                      'rgba(108, 99, 255, 0.1)';
                  }}
                >
                  <h3 style={{ margin: 0 }}>{c.name}</h3>
                </Link>
              ))}
            </Card>
            <h1>Partidas</h1>
            <Table config={configMatches} data={matches} />
          </>
        ) : (
          <>
            <InfoCard>
              <li>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>
                  {isEditing ? (
                    <input
                      type='text'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  ) : (
                    user?.email
                  )}
                </InfoValue>
              </li>
              <li>
                <InfoLabel>Score:</InfoLabel>
                <InfoValue>
                  {user?.gamers?.[0]?.score} - Nível:{' '}
                  {verifyHability(user?.gamers?.[0]?.score ?? 0)}
                </InfoValue>
              </li>
              <li>
                <InfoLabel>Time:</InfoLabel>
                <TeamInfo>
                  <span>
                    {user?.gamers?.[0]?.team?.name ??
                      'não cadastrado em nenhum time'}
                  </span>
                  {user?.gamers?.[0]?.team && (
                    <img
                      src={`http://localhost:3333/team/${user?.gamers?.[0]?.team.id}/logo`}
                      alt={`${user?.gamers?.[0]?.team.name} logo`}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </TeamInfo>
              </li>
            </InfoCard>
            <h1>Partidas</h1>
            <Table config={configMatches} data={matches} />
            <h1>Campeonatos inscritos</h1>
            <Card
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                padding: '20px',
              }}
            >
              {championships.length > 0 ? (
                championships.map(c => (
                  <Link
                    key={c.id}
                    to={`/championship/${c.id}`}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(108, 99, 255, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(108, 99, 255, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        'rgba(108, 99, 255, 0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'rgba(108, 99, 255, 0.1)';
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{c.name}</h3>
                  </Link>
                ))
              ) : (
                <h1>Nenhum</h1>
              )}
            </Card>
          </>
        )}
        {user?.profile !== 'admin' && metrics && (
          <RadarChart
            config={{
              type: 'radar',
              data: chartData,
              options: {
                elements: {
                  line: {
                    borderWidth: 3,
                  },
                },
              },
            }}
          />
        )}
      </UserData>
    </Container>
  );
}
