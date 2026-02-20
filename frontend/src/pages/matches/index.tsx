import { useEffect, useState, useRef, useCallback } from 'react';
import Loading from '../../components/loading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../services/axios';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { isAxiosError } from 'axios';
import type { Match } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  CalendarDays,
  CheckCircle2,
  SlidersHorizontal,
  PlayCircle,
} from 'lucide-react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropDownContent from './DropDownContent';
import MatchCard from '@/components/MatchCard';
import { io, Socket } from 'socket.io-client';

interface FormattedMatch {
  link: number;
  championship: string;
  championshipId: number;
  team1Name: string;
  team2Name: string;
  team1Id: number;
  team2Id: number;
  winner: string;
  status: string;
  scoreTeam1: number | null;
  scoreTeam2: number | null;
  date: string | null;
}

const statusFront = {
  playing: 'Jogando',
  pending: 'Pendente',
  finished: 'Finalizada',
};

export default function Matches() {
  const navigate = useNavigate();
  const ctx = useApp();
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [finished, setFinished] = useState<FormattedMatch[]>([]);
  const [pending, setPending] = useState<FormattedMatch[]>([]);
  const [playing, setPlaying] = useState<FormattedMatch[]>([]);
  const [filter, setFilter] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [playingCount, setPlayingCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayData] = useState<FormattedMatch[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const id = window.location.search.replace('?', '');

  // Função auxiliar para formatar uma partida
  const formatMatch = useCallback(
    (d: Match): FormattedMatch => ({
      link: d.id,
      championship: d.championship?.name,
      championshipId: d.championship?.id,
      team1Name: d.team1?.name || 'Não definido',
      team2Name: d.team2?.name || 'Não definido',
      team1Id: d.team1?.id,
      team2Id: d.team2?.id,
      winner: d?.winner?.name ?? 'Indefinido',
      status: statusFront[d.status as keyof typeof statusFront],
      scoreTeam1: d.scoreTeam1 ?? null,
      scoreTeam2: d.scoreTeam2 ?? null,
      date: d.matchDate ?? null,
    }),

    []
  );

  // Função auxiliar para processar e atualizar as partidas
  const processMatches = useCallback(
    (matchesnow: Match[]) => {
      setMatches(matchesnow.map(formatMatch));
      setFinished(
        matchesnow
          ?.filter((d: Match) => d.status === 'finished')
          .map(formatMatch)
      );
      setPlaying(
        matchesnow
          ?.filter((d: Match) => d.status === 'playing')
          .map(formatMatch)
      );
      setPending(
        matchesnow
          ?.filter((d: Match) => d.status === 'pending')
          .map(formatMatch)
      );
    },
    [formatMatch]
  );

  async function getMatches() {
    setLoading(true);
    try {
      const endpoint = id
        ? `/match?page=${page}&idChampionship=${id}`
        : `/match?page=${page}&limit=12`;

      const { data } = await api.get(endpoint);

      const matchesnow = data.matches;
      setCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);

      processMatches(matchesnow);
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

  useEffect(() => {
    if (!localStorage.getItem('token') || !ctx.user) {
      if (!ctx.isLoggingOut) {
        toast.error(
          'Você precisa estar logado para poder acessar essa pagina.'
        );
      }
      navigate('/');
      return;
    }

    async function getPlayingFinishedCount() {
      setLoading(true);
      try {
        const { data } = await api.get<{ playing: number; finished: number }>(
          '/matchesCount'
        );

        setPlayingCount(data.playing);
        setFinishedCount(data.finished);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.error ||
              'Erro ao pegar a contagem de partidas jogando e finalizadas'
          );
        } else {
          toast.error('Erro');
        }
      } finally {
        setLoading(false);
      }
    }
    getPlayingFinishedCount();
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Cleanup do socket quando o componente desmonta
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Inicializa o socket uma única vez
  useEffect(() => {
    // Cria a conexão socket apenas uma vez
    if (!socketRef.current) {
      socketRef.current = io(ctx.apiURL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket conectado:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket desconectado');
      });

      socketRef.current.on('connect_error', error => {
        console.error('Erro na conexão socket:', error);
      });
    }

    const socket = socketRef.current;

    // Função para atualizar as partidas quando receber evento do socket
    const handleMatchesUpdate = async (data: {
      playing: number;
      finished: number;
    }) => {
      // Atualiza os contadores
      setPlayingCount(data.playing);
      setFinishedCount(data.finished);

      // Recarrega os dados completos das partidas
      try {
        const currentId = window.location.search.replace('?', '');
        const endpoint = currentId
          ? `/match?page=${page}&idChampionship=${currentId}`
          : `/match?page=${page}&limit=12`;

        const { data: matchesData } = await api.get(endpoint);
        processMatches(matchesData.matches);
      } catch (error) {
        console.error('Erro ao atualizar partidas via socket:', error);
      }
    };

    // Escuta o evento correto do backend
    socket.on('matchesUpdated', handleMatchesUpdate);

    // Cleanup: remove o listener quando o componente desmonta ou quando id/page mudam
    return () => {
      socket.off('matchesUpdated', handleMatchesUpdate);
    };
  }, [page, processMatches]);

  useEffect(() => {
    const filteredData = async () => {
      // Depois aplica busca (se houver)
      if (search.trim()) {
        try {
          const { data } = await api.get(`/match?search=${search}`);
          if (data.matches && data.matches.length > 0) {
            setTotalPages(data.pagination.totalPages);
            // Processa as partidas e separa por status
            processMatches(data.matches);
            data.matches.map(formatMatch);
          }
        } catch (error) {
          console.error('Erro ao buscar:', error);
        }
      } else if (search === '') {
        getMatches();
      }
    };
    filteredData();
  }, [search, processMatches, formatMatch]);

  useEffect(() => {
    // Caso contrário, aplica o filtro nos dados locais que já foram separados por processMatches
    if (filter === 'pending') {
      setDisplayData(pending);
    } else if (filter === 'playing') {
      setDisplayData(playing);
    } else if (filter === 'finished') {
      setDisplayData(finished);
    } else {
      // Sem filtro, mostra todas as partidas
      setDisplayData(matches);
    }
  }, [matches, finished, playing, pending, filter]);

  const pagesButtons = () => {
    const buttons = [];
    if (displayData.length > 0) {
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
    }
    return buttons;
  };

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setSearch('');
      setSearchText('');
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchText(e.target.value);

    setTimeout(() => {
      setSearch(e.target.value);
      setSearchLoading(false);
    }, 2000);
  }

  return (
    <section className='flex flex-col w-full px-10 py-8 gap-10'>
      {loading && <Loading fullscreen message='Carregando dados...' />}

      <div className='max-w-[35%]'>
        <h1 className='text-4xl font-bold my-2 text-foreground'>
          Central de <span style={{ color: '#6a05f9' }}>Partidas</span>
        </h1>
        <p className='w-full text-muted-foreground'>
          Acompanhe os resultados em tempo real e estatísticas detalhadas dos
          maiores campeonatos do mundo.
        </p>
      </div>

      <div className='flex w-full gap-8'>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10'>
              <CalendarDays className='h-5 w-5 text-blue-500' />
            </div>
            Partidas
          </div>
          <CardContent className='text-4xl'>{count}</CardContent>
        </Card>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10'>
              <PlayCircle className='h-5 w-5 text-gold' />
            </div>
            Jogando agora
          </div>
          <CardContent className='text-4xl'>{playingCount}</CardContent>
        </Card>
        <Card className='flex-1'>
          <div className='flex items-center'>
            <div className='mx-5 mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10'>
              <CheckCircle2 className='h-5 w-5 text-green-500' />
            </div>
            Finalizadas
          </div>
          <CardContent className='text-4xl'>{finishedCount}</CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='w-full flex justify-between my-2 mt-7'>
          <Field className='w-[32%]' orientation='horizontal'>
            <Input
              type='search'
              placeholder='Busque por time ou campeonato'
              value={searchText}
              onChange={e => handleSearch(e)}
            />
            {searchLoading && (
              <Loading
                size='sm'
                className='bg-transparent border-0 shadow-none p-0'
              />
            )}
          </Field>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='border-input bg-transparent dark:bg-input/30'
              >
                <SlidersHorizontal className='h-4 w-4' />
                <span className='text-sm flex items-center gap-2.5 max-md:text-xs'>
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropDownContent
              selectedFilter={filter}
              setSelectedFilter={setFilter}
            />
          </DropdownMenu>
        </div>

        {displayData.length > 0 ? (
          <div className='grid grid-cols-3 gap-10'>
            {displayData.map((data, index) => (
              <MatchCard key={index} data={data} />
            ))}
          </div>
        ) : (
          <div className='flex justify-center'>
            <h1 className='font-bold text-2xl'>Nenhuma partida encontrada</h1>
          </div>
        )}
      </div>

      <div className='flex justify-end gap-2'>{pagesButtons()}</div>
    </section>
  );
}
