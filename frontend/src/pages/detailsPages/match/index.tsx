import { Link, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import api from '../../../services/axios';
import { toast } from 'sonner';
import Loading from '../../../components/loading';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import { addScore } from '../../../services/utils';
import { useApp } from '../../../contexts/AppContext';
import {
  type Match as MatchType,
  type Gamer,
  type Metric,
} from '../../../types/types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import withoutLogo from '../../../assets/withoutLogo.png';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Swords, Play, Square } from 'lucide-react';

export default function Match() {
  const ctx = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [match, setMatch] = useState<MatchType[]>([]);
  const [scoreTeam1, setScoreTeam1] = useState<number | null>(null);
  const [scoreTeam2, setScoreTeam2] = useState<number | null>(null);
  const [winner, setWinner] = useState('Indefinido');
  const [gamers, setGamers] = useState<Gamer[]>([]);
  const [loading, setLoading] = useState(false);
  const statusFront = {
    pending: `Pendente`,
    playing: `Jogando`,
    finished: `Finalizada`,
  };
  const user = ctx.user;
  // estados para o formulário de métricas
  const [metricType, setMetricType] = useState<string>('gol');
  const [metricQty, setMetricQty] = useState<number>(1);
  const [metricDesc, setMetricDesc] = useState<string>('');
  const [metricPlayerId, setMetricPlayerId] = useState<string>('');

  // lista local de métricas (exibe as carregadas + as novas enviadas)
  const [metrics, setMetrics] = useState<Metric[]>([]);

  // Tipos de métricas exibidos no Select
  const METRIC_TYPES = [
    'gol',
    'defesa',
    'falta',
    'chute ao gol',
    'assistencia',
    'cartao amarelo',
    'cartao vermelho',
  ];

  const SCORE_VALUES = {
    gol: 20,
    defesa: 15,
    falta: -3,
    'chute ao gol': 10,
    assistencia: 10,
    'cartao amarelo': 0,
    'cartao vermelho': -5,
  };

  // Função para retornar cores diferentes para cada tipo de métrica
  const getMetricColor = (type: string) => {
    const normalizedType = type?.toLowerCase() || '';
    switch (normalizedType) {
      case 'gol':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'defesa':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'falta':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'chute ao gol':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'assistencia':
        return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
      case 'cartao amarelo':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'cartao vermelho':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  // Formata a data da partida
  const formattedMatchDate = useMemo(() => {
    if (!match[0]?.matchDate) {
      return 'Data ainda não foi definida';
    }
    try {
      const date = new Date(match[0].matchDate);
      const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${formattedDate} às ${formattedTime}`;
    } catch {
      return 'Data ainda não foi definida';
    }
  }, [match]);

  // Calcula o melhor jogador baseado em métricas boas
  const bestPlayer = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    // Métricas boas (excluindo falta, cartao amarelo, cartao vermelho)
    const goodMetricTypes = ['gol', 'defesa', 'chute ao gol', 'assistencia'];

    // Filtrar apenas métricas boas
    const goodMetrics = metrics.filter(
      metric =>
        metric.gamer &&
        goodMetricTypes.includes(metric.type?.toLowerCase() || '')
    );

    if (goodMetrics.length === 0) return null;

    // Agrupar por gamer e somar quantidade
    const playerStats = new Map<
      number,
      { gamer: Gamer; totalQuantity: number }
    >();

    goodMetrics.forEach(metric => {
      if (!metric.gamer?.id) return;

      const gamerId = metric.gamer.id;
      const current = playerStats.get(gamerId);

      if (current) {
        current.totalQuantity += metric.quantity || 0;
      } else {
        playerStats.set(gamerId, {
          gamer: metric.gamer as Gamer,
          totalQuantity: metric.quantity || 0,
        });
      }
    });

    // Encontrar o jogador com mais métricas boas
    const statsArray = Array.from(playerStats.values());
    if (statsArray.length === 0) return null;

    const best = statsArray.reduce((prev, current) =>
      current.totalQuantity > prev.totalQuantity ? current : prev
    );

    if (!best.gamer?.user?.name || !best.gamer?.user?.id) {
      return null;
    }

    return { name: best.gamer.user.name, id: best.gamer.user.id };
  }, [metrics]);

  useEffect(() => {
    async function getMatch() {
      setLoading(true);
      try {
        const { data } = await api.get(`/match?idMatch=${id}`);
        setMatch(data.matches);
        setScoreTeam1(data.matches?.[0]?.scoreTeam1 ?? null);
        setScoreTeam2(data.matches?.[0]?.scoreTeam2 ?? null);
        setWinner(data?.matches?.[0]?.winner?.name || 'Indefinido');
        // tenta puxar métricas do backend (se a API já retornar junto com a partida)
        if (Array.isArray(data?.matches?.[0]?.metrics)) {
          setMetrics(data.matches[0].metrics);
        }
        // adiciona todos os gamers dos times 1 e 2 no estado gamers
        const team1Gamers = data?.matches?.[0]?.team1?.gamers || [];
        const team2Gamers = data?.matches?.[0]?.team2?.gamers || [];
        setGamers([...team1Gamers, ...team2Gamers]);
      } catch (error: any) {
        toast.error(error.response?.data?.error);
      } finally {
        setLoading(false);
      }
    }

    getMatch();
  }, [id]);

  async function handleEditWithStatus(status: string) {
    setLoading(true);
    try {
      await api.put(`/match`, {
        id: (match[0] as { id: number })?.id,
        status,
      });

      // Atualiza o estado local do match
      setMatch(prev =>
        prev.map(m => (m.id === match[0]?.id ? { ...m, status } : m))
      );

      // Se o status for 'finished', define o vencedor automaticamente
      if (status === 'finished') {
        await handleWinner();
      }

      toast.success('Status da partida atualizado com sucesso');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        toast.error(
          axiosError.response?.data?.error || 'Erro ao atualizar status'
        );
      } else {
        toast.error('Erro ao atualizar status');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await api.delete(`/match`, {
        params: { id: match[0]?.id },
      });
      toast.success('Partida deletada com sucesso!');
      navigate('/matches');
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleWinner() {
    setLoading(true);
    try {
      const team1Id = match[0]?.team1?.id;
      const team2Id = match[0]?.team2?.id;
      const currentScoreTeam1 = scoreTeam1 ?? 0;
      const currentScoreTeam2 = scoreTeam2 ?? 0;

      let winnerId: number | null = null;

      // Verifica qual time tem mais score
      if (currentScoreTeam1 > currentScoreTeam2 && team1Id) {
        winnerId = team1Id;
      } else if (currentScoreTeam2 > currentScoreTeam1 && team2Id) {
        winnerId = team2Id;
      }
      // Se houver empate, winnerId permanece null

      await api.put('/match', {
        id: (match[0] as { id: number })?.id,
        winner: winnerId,
      });

      // Atualiza o estado local do match com o vencedor
      setMatch(prev =>
        prev.map(m => {
          if (m.id === match[0]?.id) {
            const winnerTeam =
              winnerId === team1Id
                ? match[0]?.team1
                : winnerId === team2Id
                  ? match[0]?.team2
                  : null;
            return { ...m, winner: winnerTeam || null };
          }
          return m;
        })
      );

      if (winnerId) {
        const winnerName =
          winnerId === team1Id ? match[0]?.team1?.name : match[0]?.team2?.name;
        setWinner(winnerName || 'Indefinido');
        toast.success(`Vencedor definido: ${winnerName}`);
      } else {
        setWinner('Empate');
        toast.info('Partida terminou em empate');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        toast.error(
          axiosError.response?.data?.error || 'Erro ao definir vencedor'
        );
      } else {
        toast.error('Erro ao definir vencedor');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMetric(e?: React.FormEvent) {
    e?.preventDefault();
    if (!metricDesc?.trim()) {
      toast.error('Descrição é obrigatória.');
      return;
    }
    if (!metricType) {
      toast.error('Selecione um tipo.');
      return;
    }
    if (metricQty === null || metricQty === undefined || isNaN(metricQty)) {
      toast.error('Quantidade inválida.');
      return;
    }
    if (!metricPlayerId || metricPlayerId === '') {
      toast.error('Selecione o jogador.');
      return;
    }

    setLoading(true);
    try {
      const body = {
        match: (match[0] as { id: number })?.id,
        type: metricType,
        quantity: Number(metricQty),
        description: metricDesc.trim(),
        gamer: Number(metricPlayerId),
      };

      const { data } = await api.post('/metric', body);

      // busca o gamer completo no estado gamers pelo ID retornado
      const gamerFound = gamers.find(g => g.id === data?.gamer);

      const created = {
        ...data,
        gamer: gamerFound || null,
      };

      setMetrics(prev => [created, ...prev]);

      console.log(metricType);

      // Se a métrica for um gol, atualizar o score do time automaticamente
      if (metricType === 'gol') {
        // Buscar o gamer pelo ID do jogador selecionado
        const selectedGamer = gamers.find(g => g.id === Number(metricPlayerId));
        console.log(selectedGamer);

        if (selectedGamer?.team) {
          const gamerTeamId = selectedGamer.team.id;
          const team1Id = match[0]?.team1?.id;
          const team2Id = match[0]?.team2?.id;

          let newScoreTeam1 = scoreTeam1 ?? 0;
          let newScoreTeam2 = scoreTeam2 ?? 0;

          console.log(gamerTeamId, team1Id, team2Id);

          if (gamerTeamId === team1Id) {
            // Jogador é do time 1
            newScoreTeam1 = (scoreTeam1 ?? 0) + metricQty;
            setScoreTeam1(newScoreTeam1);
          } else if (gamerTeamId === team2Id) {
            // Jogador é do time 2
            newScoreTeam2 = (scoreTeam2 ?? 0) + metricQty;
            setScoreTeam2(newScoreTeam2);
          }

          // Atualizar o score no backend
          try {
            await api.put('/match', {
              id: (match[0] as { id: number })?.id,
              scoreTeam1: newScoreTeam1,
              scoreTeam2: newScoreTeam2,
            });
          } catch (error: unknown) {
            console.error('Erro ao atualizar score:', error);
            // Não mostrar erro para o usuário, apenas logar
          }
        }
      }

      // limpa formulário (mantém o jogador selecionado para facilitar múltiplas adições)
      setMetricType('gol');
      setMetricQty(1);
      setMetricDesc('');
      // NÃO limpa metricPlayerId para permitir adicionar múltiplas métricas ao mesmo jogador
      if (metricPlayerId) {
        addScore(
          SCORE_VALUES[metricType as keyof typeof SCORE_VALUES] * metricQty,
          Number(metricPlayerId)
        );
      }
      toast.success('Métrica adicionada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.erro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='flex flex-col w-full min-h-screen p-4'>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      {user?.id === match?.[0]?.championship?.admin?.id && (
        <div className='w-[90%] flex justify-start gap-2'>
          <FaTrashAlt
            size={20}
            className='mt-2.5 cursor-pointer text-destructive hover:text-red-400 transition-colors'
            onClick={handleDelete}
          />
        </div>
      )}
      {match.length > 0 ? (
        <>
          <h1 className='text-4xl text-center font-bold my-8 text-foreground'>
            {formattedMatchDate}
          </h1>
          <div className='flex gap-3'>
            {/* Match Card */}
            <Card
              className={cn(
                'flex-1 bg-card text-card-foreground',
                'border border-border rounded-xl p-6 shadow-lg'
              )}
            >
              {/* Meta Info */}
              <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
                {user?.id === match?.[0]?.championship?.admin?.id ? (
                  <div className='flex items-center gap-3'>
                    {match[0]?.status === 'pending' && (
                      <Button
                        onClick={() => handleEditWithStatus('playing')}
                        className='bg-green-600 hover:bg-green-700 text-white flex items-center gap-2'
                      >
                        <Play size={18} />
                        Iniciar partida
                      </Button>
                    )}
                    {match[0]?.status === 'playing' && (
                      <Button
                        onClick={() => handleEditWithStatus('finished')}
                        className='bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2'
                      >
                        <Square size={18} />
                        Finalizar partida
                      </Button>
                    )}
                    {match[0]?.status === 'finished' && (
                      <span className='text-muted-foreground font-medium flex items-center gap-2'>
                        <Trophy size={18} />
                        Partida finalizada
                      </span>
                    )}
                  </div>
                ) : (
                  <span
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-semibold',
                      'bg-primary/20 text-primary'
                    )}
                  >
                    {
                      statusFront[
                        (match[0]?.status as keyof typeof statusFront) ??
                          'pending'
                      ]
                    }
                  </span>
                )}
                <Button
                  variant='ghost'
                  onClick={() =>
                    navigate(`/championship/${match[0]?.championship?.id}`)
                  }
                  className='cursor-pointer'
                >
                  Campeonato: {match[0]?.championship?.name}
                </Button>
              </div>

              {/* Teams Row */}
              <div className='flex items-center justify-between gap-4 flex-wrap'>
                {match[0].team1 && (
                  <div className='flex flex-col gap-4 flex-1 min-w-[150px]'>
                    <div className='flex items-center'>
                      {match[0].team1.logo && (
                        <img
                          src={`http://localhost:3333/team/${match[0].team1.id}/logo`}
                          alt={match[0].team1.name}
                          onClick={() =>
                            navigate(`/team/${match[0].team1?.id}`)
                          }
                          className={cn(
                            'w-20 h-20 object-cover rounded-xl cursor-pointer',
                            'border-2 border-secondary shadow-md',
                            'transition-transform hover:scale-105'
                          )}
                          onError={e => {
                            e.currentTarget.src = withoutLogo;
                          }}
                        />
                      )}
                      <Button
                        variant='ghost'
                        onClick={() =>
                          navigate(`/team/${match?.[0]?.team1?.id}`)
                        }
                        className='text-xl font-bold cursor-pointer'
                      >
                        {match[0].team1.name}
                      </Button>
                    </div>
                    <h2
                      className={cn(
                        'text-4xl text-center font-bold text-primary'
                      )}
                    >
                      {scoreTeam1 ?? 0}
                    </h2>
                  </div>
                )}
                <div className='flex items-center justify-center px-4 self-stretch'>
                  <div className='flex flex-col items-center justify-center gap-2 h-full'>
                    <Swords className='w-8 h-8 text-muted-foreground' />
                    <span className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                      VS
                    </span>
                  </div>
                </div>
                {match[0].team2 && (
                  <div className='flex flex-col gap-4 flex-1 min-w-[150px]'>
                    <div className='flex flex-row-reverse items-center'>
                      {match[0].team2.logo && (
                        <img
                          src={`http://localhost:3333/team/${match[0].team2.id}/logo`}
                          alt={match[0].team2.name}
                          onClick={() =>
                            navigate(`/team/${match[0].team2?.id}`)
                          }
                          className={cn(
                            'w-20 h-20 object-cover rounded-xl cursor-pointer',
                            'border-2 border-secondary shadow-md',
                            'transition-transform hover:scale-105'
                          )}
                          onError={e => {
                            e.currentTarget.src = withoutLogo;
                          }}
                        />
                      )}
                      <Button
                        variant='ghost'
                        onClick={() =>
                          navigate(`/team/${match?.[0]?.team2?.id}`)
                        }
                        className='text-xl font-bold cursor-pointer'
                      >
                        {match[0].team2.name}
                      </Button>
                    </div>
                    <h2
                      className={cn(
                        'text-4xl text-center font-bold text-primary'
                      )}
                    >
                      {scoreTeam2 ?? 0}
                    </h2>
                  </div>
                )}
              </div>
            </Card>
            <Card
              className={cn(
                'flex-1 bg-card text-card-foreground',
                'border border-border rounded-xl p-6 shadow-lg'
              )}
            >
              <div className='flex items-center'>
                <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10'>
                  <Trophy className='h-5 w-5 text-gold' />
                </div>
                Time vecedor
              </div>
              <CardContent className='flex items-center justify-between'>
                <div className='flex flex-col'>
                  <span className='text-2xl font-bold truncate'>{winner}</span>
                  <span className='text-lg font-semibold'>
                    Melhor jogador da partida:{' '}
                    <span className='text-gold'>
                      {bestPlayer?.id ? (
                        <Link
                          to={`/user/${bestPlayer.id}`}
                          className='relative inline-block group'
                        >
                          {bestPlayer.name}
                          <span className='absolute bottom-0 left-0 h-0.5 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out w-full'></span>
                        </Link>
                      ) : (
                        'Ainda não definido'
                      )}
                    </span>
                  </span>
                </div>
                {match[0]?.winner?.id && (
                  <img
                    src={`http://localhost:3333/team/${match[0].winner.id}/logo`}
                    alt={winner}
                    className={cn(
                      'w-24 h-24 object-cover rounded-xl',
                      'border-2 border-secondary shadow-md'
                    )}
                    onError={e => {
                      e.currentTarget.src = withoutLogo;
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metrics Section */}
          <div className='w-full mx-auto my-8'>
            <h2 className='text-3xl font-bold mb-6'>Métricas</h2>

            {user?.id === match?.[0]?.championship?.admin?.id && (
              <form
                onSubmit={handleAddMetric}
                className={cn(
                  'bg-card border border-border rounded-xl p-4 mb-6',
                  'flex flex-wrap gap-3 items-end'
                )}
              >
                <Select
                  disabled={match[0]?.status !== 'playing' || !match[0]}
                  value={metricType}
                  onValueChange={value => setMetricType(value)}
                >
                  <SelectTrigger className='flex-1 min-w-[120px]'>
                    <SelectValue placeholder='Tipo da métrica' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {METRIC_TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Input
                  type='number'
                  min={0}
                  step={1}
                  value={metricQty}
                  onChange={e => setMetricQty(Number(e.target.value))}
                  placeholder='Quantidade'
                  aria-label='Quantidade'
                  className='w-24'
                  disabled={match[0]?.status !== 'playing' || !match[0]}
                />

                <Input
                  required
                  value={metricDesc}
                  onChange={e => setMetricDesc(e.target.value)}
                  placeholder='Descrição (obrigatório)'
                  aria-label='Descrição'
                  type='text'
                  className={cn(
                    'flex-1 min-w-[200px] p-2 rounded-lg',
                    'bg-transparent border border-border text-foreground',
                    'placeholder:text-muted-foreground resize-none'
                  )}
                  disabled={match[0]?.status !== 'playing' || !match[0]}
                />

                <Select
                  value={metricPlayerId}
                  onValueChange={value => setMetricPlayerId(value || '')}
                  disabled={
                    match[0]?.status !== 'playing' ||
                    !match[0] ||
                    !gamers.length
                  }
                >
                  <SelectTrigger className='flex-1 min-w-[150px]'>
                    <SelectValue
                      placeholder={
                        gamers.length
                          ? 'Selecione o jogador'
                          : 'Carregando jogadores...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {gamers.map(g => (
                        <SelectItem
                          key={g.id}
                          value={String(g.id)}
                          className='flex items-center justify-between w-full'
                        >
                          <span>{g?.user?.name}</span>
                          <span>-</span>
                          <img
                            src={`http://localhost:3333/team/${g?.team?.id}/logo`}
                            alt={match[0].team1.name}
                            onClick={() => navigate(`/team/${g?.team?.id}`)}
                            className={cn(
                              'w-10 h-10 object-cover rounded-xl cursor-pointer',
                              'border-2 border-secondary shadow-md',
                              'transition-transform hover:scale-105'
                            )}
                            onError={e => {
                              e.currentTarget.src = withoutLogo;
                            }}
                          />
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  type='submit'
                  disabled={match[0]?.status !== 'playing' || !match[0]}
                >
                  Adicionar
                </Button>
              </form>
            )}

            {/* Metrics List */}
            {metrics?.length ? (
              <div className='flex flex-col gap-3'>
                {metrics.map((m, i) => (
                  <div
                    key={m.id ?? i}
                    className={cn(
                      'flex items-center gap-4 p-4',
                      'bg-card border border-border rounded-lg',
                      'hover:border-primary transition-colors justify-between'
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-semibold capitalize border',
                          getMetricColor(m.type || '')
                        )}
                      >
                        {m.type}
                      </span>
                      <span className='text-muted-foreground text-sm'>
                        {m?.gamer?.user?.name}
                      </span>
                      <span className='text-primary font-bold'>
                        x{m.quantity}
                      </span>
                      <span className='flex-1 text-foreground/80 text-sm'>
                        {m.description}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-muted-foreground text-sm'>
                        {m.gamer?.team?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground'>
                Nenhuma métrica cadastrada
              </div>
            )}
          </div>
        </>
      ) : (
        <h1 className='text-4xl font-bold my-8 text-foreground'>Carregando</h1>
      )}
    </section>
  );
}
