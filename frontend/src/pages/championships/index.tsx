import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Table } from '../../components/Table';
import api from '../../services/axios';
import { toast } from 'sonner';
import { formatDateFullText } from '../../services/utils';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading';
import { useApp } from '../../contexts/AppContext';
import type { Championship } from '../../types/types';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { isAxiosError } from 'axios';

type ChampionshipResponse = {
  championships: Championship[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
};

export default function Championships() {
  const ctx = useApp();
  const navigate = useNavigate();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [filter, setFilter] = useState('all');
  const today = new Date().toISOString().split('T')[0];
  const user = ctx.user;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function getChampionships() {
      setLoading(true);
      try {
        const { data } = await api.get<ChampionshipResponse>(
          `championship?page=${page}`
        );
        setTotalPages(data.pagination.totalPages);
        let filtered: Championship[] = [];
        if (filter === 'all') {
          filtered = data.championships.filter(d => d.endDate >= today);
        } else if (filter === 'happening') {
          filtered = data.championships.filter(
            d => d.endDate >= today && d.startDate <= today
          );
        } else if (filter === 'pending') {
          filtered = data.championships.filter(d => d.startDate > today);
        } else if (filter === 'finished') {
          filtered = data.championships.filter(d => d.endDate < today);
        }
        filtered.forEach(f => {
          Object.assign(f, {
            endDateText: formatDateFullText(f.endDate),
            startDateText: formatDateFullText(f.startDate),
          });
        });
        setChampionships(filtered);
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

    getChampionships();
  }, [filter, today, page]);

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

  const config = [
    {
      key: 'id',
      label: 'Partidas',
      element: 'filter',
      linkDirection: 'matches',
    },
    {
      key: 'name',
      label: 'Campeonato',
      element: 'link',
      content: true,
      linkContent: 'id',
      linkDirection: 'championship',
    },
    { key: 'startDateText', label: 'Inicio', element: 'tr' },
    { key: 'endDateText', label: 'Fim', element: 'tr' },
  ];

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4'>
      {loading && <Loading fullscreen message='Carregando dados...' />}

      <h1 className='text-4xl font-bold my-8 text-foreground'>Campeonatos</h1>

      <div
        className={cn(
          'w-[90%] flex items-center justify-between gap-4',
          'flex-wrap'
        )}
      >
        {user?.profile === 'admin' && (
          <Button onClick={() => navigate('/createChampionship')}>
            Adicionar Campeonato
          </Button>
        )}
        <Select
          value={filter}
          onValueChange={value => {
            setFilter(value);
          }}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Todos os campeonatos' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value='all'>Todos os campeonatos</SelectItem>
              <SelectItem value='pending'>Pendentes</SelectItem>
              <SelectItem value='happening'>Acontecendo</SelectItem>
              <SelectItem value='finished'>Finalizados</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='w-full'>
        <Table config={config} data={championships} />
        <div className='w-[95%] gap-2 flex justify-end mt-5'>
          {createButtons()}
        </div>
      </div>
    </section>
  );
}
