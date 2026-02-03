import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../../../services/axios';
import { toast } from 'sonner';
import Loading from '../../../components/loading';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface Team {
  id: number;
  name: string;
}

export default function CreateMatch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState<Team | string>('');
  const [team2, setTeam2] = useState<Team | string>('');
  const [teamsFiltred1, setTeamsFiltred1] = useState<Team[]>([]);
  const [teamsFiltred2, setTeamsFiltred2] = useState<Team[]>([]);
  const [matchDate, setMatchDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleSelect() {
    const { data } = await api.get(`/team`);
    setTeams(data.teams);
  }

  useEffect(() => {
    if (typeof team1 === 'string' && team1.trim()) {
      const searchTerm = team1.toLowerCase().trim();
      setTeamsFiltred1(
        teams.filter(team => team?.name?.toLowerCase().includes(searchTerm))
      );
    } else {
      setTeamsFiltred1([]);
    }
    if (typeof team2 === 'string' && team2.trim()) {
      const searchTerm = team2.toLowerCase().trim();
      setTeamsFiltred2(
        teams.filter(team => team?.name?.toLowerCase().includes(searchTerm))
      );
    } else {
      setTeamsFiltred2([]);
    }
  }, [team1, team2, teams]);

  function handleSelectTeam1(teamId: number) {
    const selectedTeam = teams.find(t => t.id === teamId);
    if (selectedTeam) {
      setTeam1(selectedTeam);
      setTeamsFiltred1([]);
    }
  }

  function handleSelectTeam2(teamId: number) {
    const selectedTeam = teams.find(t => t.id === teamId);
    if (selectedTeam) {
      setTeam2(selectedTeam);
      setTeamsFiltred2([]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!team1 || !team2 || !id) {
      toast.error('Todos os campos precisam estar preenchidos');
      return;
    }
    setLoading(true);
    try {
      await api.post('/match', {
        team1: (team1 as Team).id,
        team2: (team2 as Team).id,
        championship: id,
        status: 'pending',
        matchDate: matchDate || null,
      });
      toast.success('Partida criada com sucesso!');
      navigate(`/championship/${id}`);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao criar partida');
      } else {
        toast.error('Erro ao criar partida');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4'>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <div className='w-full flex justify-start mb-4'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='flex items-center gap-2'
        >
          <ArrowLeft size={20} />
          Voltar
        </Button>
      </div>
      <h1 className='text-4xl font-bold my-8 text-foreground'>Criar partida</h1>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex flex-col items-center w-full max-w-2xl mx-auto',
          'border border-border rounded-xl p-6 shadow-lg',
          'bg-card text-card-foreground gap-4'
        )}
      >
        <h2 className='text-2xl font-semibold mb-2'>Times e premios</h2>
        <Input
          type='text'
          placeholder='Time 1'
          onSelect={handleSelect}
          value={typeof team1 === 'string' ? team1 : team1.name}
          onChange={e => {
            setTeam1(e.target.value);
          }}
          className='w-[60%]'
        />
        {teamsFiltred1.map(tF => (
          <div
            key={tF.id}
            onClick={() => handleSelectTeam1(tF.id)}
            className={cn(
              'flex w-[60%] my-1 bg-transparent p-1 rounded-md',
              'border border-border cursor-pointer',
              'hover:brightness-125 transition-all'
            )}
          >
            {tF.name}
          </div>
        ))}
        <Input
          type='text'
          placeholder='Time 2'
          onSelect={handleSelect}
          value={typeof team2 === 'string' ? team2 : team2.name}
          onChange={e => {
            setTeam2(e.target.value);
          }}
          className='w-[60%]'
        />
        {teamsFiltred2.map(tF => (
          <div
            key={tF.id}
            onClick={() => handleSelectTeam2(tF.id)}
            className={cn(
              'flex w-[60%] my-1 bg-transparent p-1 rounded-md',
              'border border-border cursor-pointer',
              'hover:brightness-125 transition-all'
            )}
          >
            {tF.name}
          </div>
        ))}
        <div className='w-[60%] flex flex-col gap-2'>
          <label
            htmlFor='matchDate'
            className='text-sm font-medium text-foreground'
          >
            Data e hora da partida
          </label>
          <Input
            id='matchDate'
            type='datetime-local'
            value={matchDate}
            onChange={e => setMatchDate(e.target.value)}
            className='w-full'
            placeholder='Selecione a data e hora'
          />
        </div>
        <Button type='submit' className='w-[60%]'>
          Enviar
        </Button>
      </form>
    </section>
  );
}
