import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/axios';
import { Table } from '../../../components/Table';
import { toast } from 'sonner';
import Loading from '../../../components/loading';
import { FaCheck, FaTimesCircle, FaUserAlt } from 'react-icons/fa';
import { formatMetricsForChart } from '../../../services/utils';
import RadarChart from '../../../components/RadarChart';
import FileInput from '../../../components/FileInput';
import { useNotifications } from '../../../hooks/useNotifications';
import { useApp } from '../../../contexts/AppContext';
import type { Match, Team as TeamType } from '../../../types/types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { isAxiosError } from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import withoutLogo from '@/assets/withoutLogo.png';

export default function Team() {
  const { id } = useParams();
  const ctx = useApp();
  const user = ctx.user;
  const [team, setTeam] = useState<TeamType>();
  const [gamers, setGamers] = useState<
    { name: string; score: number; hability: string | undefined }[]
  >([]);
  const [matches, setMatches] = useState<
    {
      link: number;
      championship: string | undefined;
      championshipId: number | undefined;
      team1: string | undefined;
      team2: string | undefined;
      winner: string;
      status: string;
    }[]
  >([]);
  const [filter] = useState('');
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState<Record<string, number>>({});
  const [logoLoading, setLogoLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { createNotifications } = useNotifications({ setLoading });

  const haveTeamIsgamer =
    user?.profile === 'gamer' &&
    user?.gamers?.[0]?.team === null &&
    team?.gamer?.id !== user.gamers[0].id;

  const canLeaveTeam =
    user?.profile === 'gamer' &&
    user?.gamers?.[0]?.team?.id === team?.id &&
    team?.gamer?.id !== user?.gamers?.[0]?.id;

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
      setLogoLoading(true);
      try {
        const { data } = await api.get(`team?id=${id}`);
        setTeam(data.teams[0]);
        setName(data.teams[0].name);
        const gamersData = data.teams[0].gamers.map(
          (g: { user: { name: string }; score: number }) => {
            return {
              name: g.user.name,
              score: g.score,
              hability: verifyHability(g.score),
            };
          }
        );

        setGamers(
          gamersData.sort((a: { score: number }, b: { score: number }) =>
            a.score > b.score ? -1 : 1
          )
        );

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
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro');
        } else {
          toast.error('Erro');
        }
      } finally {
        setLoading(false);
      }
    }

    async function getMatches() {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await api.get<{ count: number; matches: Match[] }>(
          `/match?page=${page}&limit=100&idTeam=${id}`
        );

        if (!data.matches || data.matches.length === 0) {
          setMatches([]);
          return;
        }

        let frontData;
        if (
          filter === 'finished' ||
          filter === 'playing' ||
          filter === 'pending'
        ) {
          frontData = data.matches
            .filter(d => d.status === filter)
            .map(d => ({
              link: d.id,
              championship: d?.championship?.name,
              championshipId: d?.championship?.id,
              team1: d?.team1?.name,
              team2: d?.team2?.name,
              winner: d?.winner?.name ?? 'Indefinido',
              status: statusFront[d.status as keyof typeof statusFront],
            }));
        } else {
          // Quando não há filtro específico, mostra todas as partidas
          frontData = data.matches.map(d => ({
            link: d.id,
            championship: d?.championship?.name,
            championshipId: d?.championship?.id,
            team1: d?.team1?.name,
            team2: d?.team2?.name,
            winner: d?.winner?.name ?? 'Indefinido',
            status: statusFront[d.status as keyof typeof statusFront],
          }));
        }

        setMatches(frontData);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro');
        } else {
          toast.error('Erro');
        }
      } finally {
        setLoading(false);
      }
    }

    getTeam();
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          id: team?.id,
          name,
        });
        toast.success('Time editado com sucesso');
        return;
      }
      const fd = new FormData();
      fd.append('id', String(team?.id ?? ''));
      fd.append('logo', logo);
      fd.append('name', name);
      await api.put('/team', fd);
      toast.success('Time editado com sucesso');
      return;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao editar time');
      } else {
        toast.error('Erro ao editar time');
      }
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }

  async function handleNotification() {
    if (!team?.gamer?.user?.id || !user?.gamers?.[0]?.id || !team?.id) return;
    await createNotifications(
      'team_accept',
      team.gamer.user.id,
      user.gamers[0].id,
      ``,
      team.id
    );
  }

  async function handleLeaveTeam() {
    if (!team?.gamer?.user?.id || !user?.gamers?.[0]?.id || !team?.id) return;
    await createNotifications(
      'team_leave',
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
    <section className='flex flex-col w-full min-h-screen p-4'>
      {haveTeamIsgamer && (
        <div className='w-[90%] m-5 flex justify-end gap-2'>
          <Button
            onClick={e => {
              e.preventDefault();
              handleNotification();
            }}
          >
            Solicitar para entrar no time
          </Button>
        </div>
      )}
      {canLeaveTeam && (
        <div className='w-[90%] m-5 flex justify-end gap-2'>
          <Button
            variant='destructive'
            onClick={e => {
              e.preventDefault();
              handleLeaveTeam();
            }}
          >
            Solicitar para sair do time
          </Button>
        </div>
      )}
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <div className='relative rounded-[40px] overflow-hidden bg-card border border-border mb-10 min-h-[300px] shadow-2xl group'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0'>
          <img
            src='https://images.unsplash.com/photo-1516205651411-a8531c5d65c0?q=80&w=2070&auto=format&fit=crop'
            className='w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700'
          />
          <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent'></div>
          <div className='absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent'></div>
        </div>

        {/* Content */}
        <div className='absolute bottom-0 left-0 right-0 p-10 flex flex-col md:flex-row items-end justify-between'>
          <div className='flex items-center gap-8'>
            <div className='relative w-32 h-32 border border-secondary rounded-3xl flex items-center justify-center shadow-secondary overflow-hidden'>
              {logoLoading && (
                <div className='h-full w-full absolute inset-0 flex items-center justify-center z-10 bg-background/50'>
                  <Loading className='bg-transparent border-none' />
                </div>
              )}
              <img
                src={`${ctx.apiURL}/team/${id}/logo`}
                alt={`Logo do time ${name}`}
                className={cn(
                  'h-full w-full object-cover rounded-3xl transition-opacity duration-300',
                  logoLoading ? 'opacity-0' : 'opacity-100'
                )}
                onLoad={() => setLogoLoading(false)}
                onError={e => {
                  e.currentTarget.src = withoutLogo;
                  setLogoLoading(false);
                }}
              />
            </div>
            <div className='flex items-center gap-10'>
              <div>
                {isEditing ? (
                  <>
                    <Input
                      className='max-w-120 text-5xl md:text-7xl font-black text-card-foreground tracking-tighter mb-2 bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 pl-2'
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <div className='flex gap-5'>
                      <FileInput
                        id='logo'
                        name='logo'
                        accept='image/*'
                        value={logo}
                        onChange={setLogo}
                        placeholder='Selecionar novo logo'
                        maxSize={5}
                        className='w-full'
                      />
                    </div>
                  </>
                ) : (
                  <h1 className='text-5xl md:text-7xl font-black text-card-foreground tracking-tighter mb-2'>
                    {team?.name}
                  </h1>
                )}
              </div>
              {logo && (
                <div>
                  <div className='w-[125px] h-[125px] md:w-[125px] md:h-[125px] border-2 border-destructive rounded-2xl overflow-hidden bg-secondary'>
                    <img
                      src={URL.createObjectURL(logo)}
                      alt='Preview do novo logo'
                      className='w-full h-full object-cover'
                      onLoad={e =>
                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {user?.gamers?.[0]?.id === team?.gamer?.id && (
            <div>
              {isEditing ? (
                <div className='flex items-center gap-4 px-6 py-3 bg-card-foreground/5 hover:bg-card-foreground/10 border border-border backdrop-blur-md rounded-xl text-card-foreground font-bold transition-all group-hover:border-purple-500/50'>
                  <button
                    className='cursor-pointer text-destructive hover:text-destructive/80'
                    onClick={() => setIsEditing(false)}
                  >
                    <FaTimesCircle size={20} />
                  </button>
                  <button
                    className='cursor-pointer text-green-500 hover:text-green-600'
                    onClick={handleEdit}
                  >
                    <FaCheck size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className='flex items-center gap-2 px-6 py-3 bg-card-foreground/5 hover:bg-card-foreground/10 border border-border backdrop-blur-md rounded-xl text-card-foreground font-bold transition-all group-hover:border-purple-500/50'
                >
                  <Edit size={18} />
                  Editar Time
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {team?.id ? (
        <div className='w-full'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 px-10'>
            {/* Radar Chart */}
            <div className='w-full h-[400px] lg:h-[500px] flex items-center justify-center'>
              <div className='w-full h-full'>
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
              </div>
            </div>

            {/* Team Info Section */}
            <div className='w-full flex flex-col gap-20 relative'>
              {/* Responsible Card */}
              <Card className='w-full'>
                <div className='flex items-center'>
                  <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10'>
                    <Crown className='h-5 w-5 text-purple-500' />
                  </div>
                  Responsável do time
                </div>
                <CardContent className='flex flex-col items-center mt-5 gap-5'>
                  <div className='relative w-32 h-32 rounded-3xl bg-muted border-4 border-card shadow-2xl overflow-hidden flex items-center justify-center'>
                    {imageLoading && !imageError && (
                      <div className='absolute inset-0 flex items-center justify-center z-10 bg-background/50'>
                        <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                      </div>
                    )}
                    {imageError ? (
                      <div className='w-full h-full flex items-center justify-center text-muted-foreground bg-muted'>
                        <FaUserAlt size={48} />
                      </div>
                    ) : (
                      <img
                        src={`${ctx.apiURL}/user/${team?.gamer?.user?.id}/profilePicture`}
                        alt={`Foto de perfil de ${team?.gamer?.user?.name || 'Responsável'}`}
                        className={cn(
                          'w-full h-full object-cover transition-opacity duration-300',
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        )}
                        onLoad={() => {
                          setImageLoading(false);
                          setImageError(false);
                        }}
                        onError={() => {
                          setImageError(true);
                          setImageLoading(false);
                        }}
                      />
                    )}
                  </div>
                  <div className='flex flex-col items-center'>
                    <span className='text-2xl md:text-3xl font-bold truncate'>
                      {team?.gamer?.user?.name || 'Não definido'}
                    </span>
                    <p className='text-muted-foreground'>
                      Score: {team?.gamer?.score.toLocaleString('pt-br')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <h2 className='ml-20 text-3xl font-bold my-6 text-foreground'>
            Jogadores
          </h2>
          <Table config={config} data={gamers} />
          <h2 className='ml-20 text-3xl font-bold my-6 text-foreground'>
            Partidas
          </h2>
          <Table config={configMatches} data={matches} />
        </div>
      ) : (
        <h1 className='text-2xl font-semibold text-muted-foreground'>
          Carregando
        </h1>
      )}
    </section>
  );
}
