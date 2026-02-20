import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import Loading from '../../components/loading';
import api from '../../services/axios';
import { useApp } from '../../contexts/AppContext';
import type { Gamer, Team } from '../../types/types';
import { TeamCard } from '@/components/TeamCard';
import { Filter, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DropDownContent from './DropDownContent';

type TeamResponse = {
  teams: Team[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
};

export default function Home() {
  const navigate = useNavigate();
  const ctx = useApp();
  const [teams, setTeams] = useState<
    {
      id: number;
      name: string;
      gamer: string;
      score: number;
      position?: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'score' | 'name'>(
    'score'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ordena os times
  const filteredTeams = teams.sort((a, b) => {
    if (selectedFilter === 'score' && search === '') {
      return b.score - a.score;
    } else if (selectedFilter === 'score' && search !== '') {
      // Quando há busca, ordena por position se disponível, senão por score
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      if (a.position !== undefined) return -1;
      if (b.position !== undefined) return 1;
      return b.score - a.score;
    }
    return a.name.localeCompare(b.name);
  });

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
    async function getTeams() {
      setLoading(true);
      try {
        const { data } = await api.get<TeamResponse>(`/team?page=${page}`);
        setTotalPages(data.pagination.totalPages);
        const teamsData = data.teams.map(
          (team: Team & { position?: number }) => {
            if ((team?.gamers?.length ?? 0) <= 0)
              return {
                id: team.id,
                name: team.name,
                gamer: 'Nenhum jogador cadastrado',
                score: 0,
                position: team.position,
              };
            const teamScore = (team.gamers ?? []).reduce(
              (sum: number, g: Gamer) => sum + (Number(g?.score) || 0),
              0
            );

            const gamerData = team?.gamers?.reduce(
              (max: Gamer, current: Gamer) =>
                current.score > max.score ? current : max
            );

            return {
              id: team.id,
              name: team.name,
              gamer: gamerData?.user?.name || 'Jogador não encontrado',
              score: teamScore,
              position: team.position,
            };
          }
        );
        const OrderedTeams = teamsData.sort((a, b) =>
          a.score > b.score ? -1 : 1
        );
        setTeams(OrderedTeams);
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

    getTeams();
  }, [navigate, ctx.user, ctx.isLoggingOut, page]);

  useEffect(() => {
    async function getTeamsSearch() {
      setLoading(true);
      try {
        const { data } = await api.get<TeamResponse>(`/team?search=${search}`);
        setTotalPages(data.pagination.totalPages);
        const teamsData = data.teams.map(
          (team: Team & { position?: number }) => {
            if ((team?.gamers?.length ?? 0) <= 0)
              return {
                id: team.id,
                name: team.name,
                gamer: 'Nenhum jogador cadastrado',
                score: 0,
                position: team.position,
              };
            const teamScore = (team.gamers ?? []).reduce(
              (sum: number, g: Gamer) => sum + (Number(g?.score) || 0),
              0
            );

            const gamerData = team?.gamers?.reduce((max, current) =>
              current.score > max.score ? current : max
            );

            return {
              id: team.id,
              name: team.name,
              gamer: gamerData?.user?.name || 'Jogador não encontrado',
              score: teamScore,
              position: team.position,
            };
          }
        );
        const OrderedTeams = teamsData.sort((a, b) =>
          a.score > b.score ? -1 : 1
        );
        setTeams(OrderedTeams);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro');
        } else {
          toast.error('Erro');
        }
      } finally {
        setPage(1);
        setLoading(false);
      }
    }
    getTeamsSearch();
  }, [search]);

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
    <section className='flex p-10 gap-10 flex-col items-center w-full'>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <div className='flex flex-col items-center'>
        <h1 className='text-5xl font-bold my-2 text-foreground'>
          Ranking de times
        </h1>
        <p className='w-[70%] text-center text-muted-foreground'>
          Confira os melhores times da comunidade e acompanhe sua evolução ao
          longo da temporada. Suba no ranking e conquiste o topo!
        </p>
      </div>
      <div className='w-full flex flex-col gap-3'>
        <div className='w-full flex my-2'>
          <Field orientation='horizontal'>
            <Input
              className='w-[35%]'
              type='search'
              placeholder={'Busque por um time'}
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
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => {
            // Mantém a posição original no ranking (não muda com o filtro)
            const originalPosition =
              search !== '' && team.position !== undefined
                ? team.position
                : teams.findIndex(t => t.id === team.id) + 1;
            return (
              <TeamCard
                key={team.id}
                id={team.id}
                position={(page - 1) * 10 + originalPosition}
                name={team.name}
                bestPlayer={team.gamer}
                score={team.score}
                isTopThree={originalPosition <= 3}
              />
            );
          })
        ) : (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center'>
            <div className='mb-4 rounded-full bg-secondary p-4'>
              <Trophy className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-foreground'>
              Nenhum time encontrado
            </h3>
            <p className='text-sm text-muted-foreground'>
              {search
                ? 'Nenhum time corresponde à sua busca.'
                : 'Não há times cadastrados ainda.'}
            </p>
          </div>
        )}
        <div className='flex justify-end gap-2 mt-5'>{createButtons()}</div>
      </div>
    </section>
  );
}
