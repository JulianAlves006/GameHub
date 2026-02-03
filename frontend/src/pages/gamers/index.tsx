import { useEffect, useMemo, useState } from 'react';
import Loading from '../../components/loading';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../services/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Trophy, Shield, Filter } from 'lucide-react';
import GamerCard from '@/components/GamerCard';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DropDownContent, { type FilterType } from './DropDownContent';
import { Field } from '@/components/ui/field';
import type { Gamer } from '@/types/types';

interface Metric {
  id: number;
  quantity: number;
  type: string;
  description: string;
  createdAt: string;
}

interface TopThree {
  topScorer: { id: number; name: string; score: number } | null;
  topGoalScorer: { id: number; name: string; goals: number } | null;
  topGoalkeeper: { id: number; name: string; saves: number } | null;
}

interface FormattedGamer {
  id: number;
  userID: number | undefined;
  name: string;
  score: number;
  metrics: Metric[];
  teamID: number | null;
  team: string;
  shirtNumber: number;
}

export default function Gamers() {
  const [loading, setLoading] = useState(false);
  const [gamers, setGamers] = useState<FormattedGamer[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('score');
  const [topScorer, setTopScorer] = useState<{
    id: number;
    name: string;
    score: number;
  } | null>(null);
  const [topGoalScorer, setTopGoalScorer] = useState<{
    id: number;
    name: string;
    goals: number;
  } | null>(null);
  const [topGoalkeeper, setTopGoalkeeper] = useState<{
    id: number;
    name: string;
    saves: number;
  } | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  // Função para calcular total de uma métrica específica
  const getMetricTotal = (metrics: Metric[], metricType: string): number => {
    return (metrics || []).reduce((total, metric) => {
      if (metric.type?.toLowerCase() === metricType.toLowerCase()) {
        return total + (metric.quantity || 0);
      }
      return total;
    }, 0);
  };

  // Filtra e ordena os gamers
  const filteredAndSortedGamers = useMemo(() => {
    const filtered = gamers.filter(gamer =>
      gamer.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (selectedFilter) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'gol':
        case 'defesa':
        case 'falta':
        case 'chute ao gol':
        case 'assistencia':
        case 'cartao amarelo':
        case 'cartao vermelho':
          return (
            getMetricTotal(b.metrics, selectedFilter) -
            getMetricTotal(a.metrics, selectedFilter)
          );
        default:
          return 0;
      }
    });
  }, [gamers, search, selectedFilter]);

  // Busca gamers e calcula estatísticas
  useEffect(() => {
    async function getTopThree() {
      setLoading(true);
      try {
        const { data } = await api.get<TopThree>('/gamer/top');
        setTopScorer(data.topScorer);
        setTopGoalScorer(data.topGoalScorer);
        setTopGoalkeeper(data.topGoalkeeper);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.error || 'Erro ao carregar top gamers'
          );
        } else {
          toast.error('Erro ao carregar top gamers');
        }
      } finally {
        setLoading(false);
      }
    }

    async function getGamers() {
      try {
        setLoading(true);
        const { data } = await api.get(`/gamer?page=${page}&limit=10`);

        setTotalPages(data.pagination.totalPages);

        const formatedGamers = data.gamers.map((gamer: Gamer) => {
          return {
            id: gamer.id,
            userID: gamer.user?.id,
            name: gamer.user?.name || 'Nome não encontrado',
            score: gamer.score || 0,
            metrics: gamer.metrics,
            teamID: gamer?.team?.id || null,
            team: gamer?.team?.name || 'Nenhum time no momento',
            shirtNumber: gamer.shirtNumber,
          };
        });

        setGamers(formatedGamers);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro ao carregar gamers');
        } else {
          toast.error('Erro ao carregar gamers');
        }
      } finally {
        setLoading(false);
      }
    }
    getTopThree();
    getGamers();
  }, [page]);

  const createButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => setPage(i)}
          variant={page === i ? 'default' : 'outline'}
          size='sm'
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <section className='flex flex-col items-start gap-8 w-full min-h-screen px-10 py-8'>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <div className='my-6'>
        <h1 className='text-4xl font-bold my-2 text-foreground'>
          Ranking de <span style={{ color: '#6a05f9' }}>Jogadores</span>
        </h1>
        <p className='w-full text-muted-foreground'>
          Acompanhe os melhores jogadores da comunidade e suas estatisticas
        </p>
      </div>
      <div className='flex w-full gap-8'>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10'>
              <Trophy className='h-5 w-5 text-gold' />
            </div>
            Maior Jogador
          </div>
          <CardContent className='flex flex-col'>
            <span className='text-lg font-semibold truncate'>
              {topScorer?.name}
            </span>
            <span className='text-2xl font-bold text-gold'>
              {topScorer?.score.toLocaleString('pt-br')} pontos de score
            </span>
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10'>
              <Zap className='h-5 w-5 text-blue-500' />
            </div>
            Maior atacante
          </div>
          <CardContent className='flex flex-col'>
            <span className='text-lg font-semibold truncate'>
              {topGoalScorer?.name}
            </span>
            <span className='text-2xl font-bold text-blue-500'>
              {topGoalScorer?.goals} gols
            </span>
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10'>
              <Shield className='h-5 w-5 text-green-500' />
            </div>
            Maior goleiro
          </div>
          <CardContent className='flex flex-col'>
            <span className='text-lg font-semibold truncate'>
              {topGoalkeeper?.name}
            </span>
            <span className='text-2xl font-bold text-green-500'>
              {topGoalkeeper?.saves} defesas
            </span>
          </CardContent>
        </Card>
      </div>
      <div className='w-full flex flex-col gap-2'>
        <div className='w-full flex justify-between my-2'>
          <Field className='w-[35%]' orientation='horizontal'>
            <Input
              type='search'
              placeholder='Busque por um jogador'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Field>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='border-input bg-transparent dark:bg-input/30'
              >
                <Filter className='h-4 w-4' />
                <span className='text-sm flex items-center gap-2.5 max-md:text-xs'>
                  Ordenar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropDownContent
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </DropdownMenu>
        </div>
        {filteredAndSortedGamers.map((gamer, index) => (
          <GamerCard
            key={gamer.id}
            data={gamer}
            position={(page - 1) * 10 + index + 1}
            metrics={gamer.metrics}
            bestGamerID={topScorer?.id}
          />
        ))}
        {totalPages > 0 && (
          <div className='flex justify-end gap-2 mt-5'>{createButtons()}</div>
        )}
      </div>
    </section>
  );
}
