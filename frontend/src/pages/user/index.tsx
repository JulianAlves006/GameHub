import { useEffect, useState, useMemo } from 'react';
import { Card, Container, Left, Title } from '../../style';
import { UserData, InfoCard, TeamInfo, InfoLabel, InfoValue } from './styled';
import api from '../../services/axios';
import { toast } from 'react-toastify';
import { Table } from '../../components/Table';
import { Link } from 'react-router-dom';
import Loading from '../../components/loading';
import { FaEdit, FaWindowClose, FaCheck } from 'react-icons/fa';
import { isEmail } from 'validator';
import { formatMetricsForChart, getUser } from '../../services/utils';
import RadarChart from '../../components/RadarChart';
export default function User() {
  const user = getUser();
  const [matches, setMatches] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [metrics, setMetrics] = useState<
    { type: string; quantity: number }[] | undefined
  >();

  const chartData = useMemo(() => {
    console.log('chartData useMemo - metrics:', metrics);
    console.log('chartData useMemo - isArray:', Array.isArray(metrics));

    if (!metrics) {
      console.log('Sem métricas, retornando objeto vazio');
      return formatMetricsForChart({
        metrics: {},
        label: user.name || 'Meu Perfil',
      });
    }

    const result = formatMetricsForChart({
      metrics: metrics,
      label: user.name || 'Meu Perfil',
    });

    console.log('chartData result:', result);
    return result;
  }, [metrics, user.name]);

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

  useEffect(() => {
    if (user.profile === 'admin') {
      getChampionships();
    } else {
      const gamerMetrics = user?.gamers?.[0]?.metrics;
      console.log('Métricas do gamer:', gamerMetrics);
      setMetrics(gamerMetrics);
      getMatches();
    }
  }, []);

  async function getChampionships() {
    setLoading(true);
    try {
      const { data } = await api.get(`/championship?idAdmin=${user.id}`);
      setChampionships(data);
      const dataFormated = data.map(d => d.matches).flat();
      const frontData = dataFormated
        ?.filter(d => d.status !== 'finished')
        .map(d => ({
          link: d.id,
          championship: d.championship.name,
          championshipId: d.championship.id,
          team1: d.team1.name,
          team2: d.team2.name,
          winner: d?.winner?.name ?? 'Indefinido',
          status: statusFront[d.status as keyof typeof statusFront],
        }));
      setMatches(frontData);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.response?.error || error);
    } finally {
      setLoading(false);
    }
  }

  async function getMatches() {
    setLoading(true);
    try {
      // Verifica se o gamer tem um time antes de buscar partidas
      if (!user.gamers[0].team) {
        setMatches([]);
        return;
      }

      const { data } = await api.get(`match?idTeam=${user.gamers[0].team.id}`);
      const frontData = data
        ?.filter(d => d.status !== 'finished')
        .map(d => ({
          link: d.id,
          championship: d.championship.name,
          championshipId: d.championship.id,
          team1: d.team1.name,
          team2: d.team2.name,
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
        id: user.id,
        name,
        email,
      });
      toast.success('Usuário editado com sucesso!');
      setIsEditing(false);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          name,
          email,
        })
      );
    } catch (error: any) {
      toast.error(error?.data?.response?.erro || 'Erro ao editar usuário');
    }
  }

  return (
    <Container>
      {user.profile !== 'admin' && (
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
      {championships.length > 0 && user.profile === 'admin' && (
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
        {user.profile === 'admin' ? (
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
                    user.email
                  )}
                </InfoValue>
              </li>
              <li>
                <InfoLabel>Score:</InfoLabel>
                <InfoValue>
                  {user.gamers[0].score} - Nível:{' '}
                  {verifyHability(user.gamers[0].score)}
                </InfoValue>
              </li>
              <li>
                <InfoLabel>Time:</InfoLabel>
                <TeamInfo>
                  <span>
                    {user.gamers[0].team?.name ??
                      'não cadastrado em nenhum time'}
                  </span>
                  {user.gamers[0].team && (
                    <img
                      src={`http://localhost:3333/team/${user.gamers[0].team.id}/logo`}
                      alt={`${user.gamers[0].team.name} logo`}
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
        {user.profile !== 'admin' && metrics && (
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
