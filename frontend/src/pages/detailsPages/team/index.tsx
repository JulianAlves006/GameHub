import { useEffect, useState, useMemo } from 'react';
import { Card, Container, Left, Right, Title } from '../../../style';
import { useParams } from 'react-router-dom';
import api from '../../../services/axios';
import { Logo, Matches } from './styled';
import { Table } from '../../../components/Table';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';
import { FaCheck, FaEdit, FaWindowClose } from 'react-icons/fa';
import {
  createNotifications,
  formatMetricsForChart,
  getUser,
} from '../../../services/utils';
import RadarChart from '../../../components/RadarChart';
import FileInput from '../../../components/FileInput';

export default function Team() {
  const { id } = useParams();
  const user = getUser();
  const [team, setTeam] = useState([]);
  const [gamers, setGamers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState<Record<string, number>>({});

  const haveTeamIsgamer =
    user?.profile === 'gamer' && user.gamers[0]?.team === null;

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

  useEffect(() => {
    async function getTeam() {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await api.get(`team?id=${id}`);
        setTeam(data.teams[0]);
        setName(data.teams[0].name);
        const gamersData = data.teams[0].gamers.map(g => {
          return {
            name: g.user.name,
            score: g.score,
            hability: verifyHability(g.score),
          };
        });

        setGamers(gamersData.sort((a, b) => (a.score > b.score ? -1 : 1)));

        // Soma todas as métricas de todos os jogadores do time
        const metricsSum: Record<string, number> = {};

        if (data.teams[0]?.gamers) {
          data.teams[0].gamers.forEach(
            (gamer: { metrics?: { type: string; quantity: number }[] }) => {
              if (gamer.metrics && Array.isArray(gamer.metrics)) {
                gamer.metrics.forEach(
                  (metric: { type: string; quantity: number }) => {
                    const metricType = metric.type?.toLowerCase() || '';
                    const quantity = metric.quantity || 0;

                    if (metricType) {
                      if (!metricsSum[metricType]) {
                        metricsSum[metricType] = 0;
                      }
                      metricsSum[metricType] += quantity;
                    }
                  }
                );
              }
            }
          );
        }

        setTeamMetrics(metricsSum);
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    async function getMatches() {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/match?page=${page}&idTeam=${id}`);
        let frontData;
        if (
          filter === 'finished' ||
          filter === 'playing' ||
          filter === 'pending'
        ) {
          frontData = data
            ?.filter(d => d.status === filter)
            .map(d => ({
              link: d.id,
              championship: d.championship.name,
              championshipId: d.championship.id,
              team1: d.team1.name,
              team2: d.team2.name,
              winner: d?.winner?.name ?? 'Indefinido',
              status: statusFront[d.status as keyof typeof statusFront],
            }));
        } else {
          frontData = data
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
        }

        setMatches(frontData);
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getTeam();
    getMatches();
  }, [id, page, filter]);

  async function handleEdit() {
    setLoading(true);
    if (!name) {
      toast.error('O nome do time não pode ser nulo');
      return;
    }
    try {
      if (!logo) {
        await api.put('/team', {
          id: team.id,
          name,
        });
        toast.success('Time editado com sucesso');
        return;
      }
      const fd = new FormData();
      fd.append('id', team.id);
      fd.append('logo', logo);
      fd.append('name', name);
      await api.put('/team', fd);
      toast.success('Time editado com sucesso');
      return;
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Erro ao editar time');
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }

  async function handleNotification() {
    await createNotifications(
      'team_accept',
      team.gamer.user.id,
      user.gamers[0].id,
      ``,
      team.id
    );
  }

  const config = [
    { key: 'position', label: 'Posição', element: 'tr' },
    { key: 'name', label: 'Jogador', element: 'tr' },
    { key: 'score', label: 'Score', element: 'tr' },
    { key: 'hability', label: 'Habilidade', element: 'tr' },
  ];

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

  // Formata as métricas do time para o formato do gráfico
  const chartData = useMemo(() => {
    return formatMetricsForChart({
      metrics: teamMetrics,
      label: name || 'Time',
    });
  }, [teamMetrics, name]);

  return (
    <Container>
      {haveTeamIsgamer && (
        <Right>
          <button
            onClick={e => {
              e.preventDefault();
              handleNotification();
            }}
          >
            Solicitar para entrar no time
          </button>
        </Right>
      )}
      {user?.gamers?.[0].id === team?.gamer?.id && (
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
      )}
      {loading && <Loading fullscreen message='Carregando dados...' />}
      {team.id ? (
        <>
          <Logo
            src={`http://localhost:3333/team/${team.id}/logo`}
            alt={`${team.name} logo`}
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          {isEditing ? (
            <>
              <FileInput
                id='logo'
                name='logo'
                accept='image/*'
                value={logo}
                onChange={setLogo}
                label='Logo do Time'
                placeholder='Selecionar novo logo'
                maxSize={5}
              />
              <Title>
                <input
                  type='text'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Title>
            </>
          ) : (
            <Title>{name}</Title>
          )}
          <Table config={config} data={gamers} />
          <Matches>Partidas</Matches>
          <Table config={configMatches} data={matches} />
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
          <Card style={{ display: 'flex', justifyContent: 'center' }}>
            <h3>Responsavel do time: {team.gamer.user.name}</h3>
          </Card>
        </>
      ) : (
        <h1>Carregando</h1>
      )}
    </Container>
  );
}
