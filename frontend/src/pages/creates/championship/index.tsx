import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import api from '../../../services/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loading from '../../../components/loading';
import AwardSelector from '../../../components/AwardSelector';
import type { Award } from '../../../types/types';
import { useApp } from '../../../contexts/AppContext';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Confirmation from './confirmation';
import { isAxiosError } from 'axios';

export default function CreateChampionship() {
  const ctx = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [endDate, setEndDate] = useState('');
  const [selectedAwards, setSelectedAwards] = useState<
    { id: number; description: string; uniqueIndex?: number }[]
  >([]);
  const user = ctx.user;
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (user?.profile !== 'admin') {
      toast.error(
        'Somente usuários administradores podem adicionar novos campeonatos'
      );
      navigate('/championships');
    }
    async function getAwards() {
      setLoading(true);
      try {
        const { data } = await api.get(`/award?id=${user?.id}`);
        setAwards(data);
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

    getAwards();
  }, []);

  useEffect(() => {
    setCanSubmit(!!(name && startDate && endDate));
  }, [startDate, endDate, name]);

  const handleAwardSelect = (award: {
    id: number;
    description: string;
    uniqueIndex?: number;
  }) => {
    setSelectedAwards(prev => [
      ...prev,
      {
        id: award.id,
        description: award.description,
        uniqueIndex: award.uniqueIndex ?? Date.now() + Math.random(),
      },
    ]);
  };

  const handleAwardRemove = (index: number) => {
    setSelectedAwards(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewAwardRemove = (uniqueIndex: number) => {
    setSelectedAwards(prev =>
      prev.filter(award => award.uniqueIndex !== uniqueIndex)
    );
  };

  async function submitChampionship() {
    setLoading(true);
    try {
      if (new Date(startDate) > new Date(endDate)) {
        toast.error('Data de início deve ser anterior à data de término');
        return;
      }

      if (!name || !startDate || !endDate) {
        toast.error('Nome, data de inicio e data de fim são obrigatórios!');
        return;
      }

      const awardsSelectedsIDS = selectedAwards.map(sA => sA.id);

      await api.post('championship', {
        name,
        startDate,
        endDate,
        awards: awardsSelectedsIDS,
      });
      toast.success('Campeonato criado com sucesso!');
      navigate('/championships');
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

  return (
    <AlertDialog>
      <section className='flex flex-col items-center w-full p-4'>
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
        <h1 className='text-4xl font-bold my-8 text-foreground'>
          Criação de campeonatos
        </h1>
        <form
          className={cn(
            'relative flex flex-col items-center w-full max-w-2xl mx-auto',
            'border border-border rounded-xl p-6 shadow-lg',
            'bg-card text-card-foreground gap-4'
          )}
        >
          <h2 className='text-2xl font-semibold mb-2'>Campeonato</h2>
          <Input
            type='text'
            value={name}
            placeholder='Nome do seu campeonato'
            onChange={e => setName(e.target.value)}
            className='w-[60%]'
          />
          <div className='flex flex-col gap-2 w-[60%]'>
            <Label htmlFor='startDate'>Data de inicio</Label>
            <Input
              id='startDate'
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2 w-[60%]'>
            <Label htmlFor='endDate'>Data de término</Label>
            <Input
              id='endDate'
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <AwardSelector
            awards={awards}
            selectedAwards={selectedAwards}
            onAwardSelect={handleAwardSelect}
            onAwardRemove={handleAwardRemove}
            onNewAwardRemove={handleNewAwardRemove}
            placeholder='Selecionar prêmios'
          />
          {!canSubmit && (
            <p className='text-xs text-muted-foreground'>
              Preencha todas as informações para prosseguir!
            </p>
          )}
          <AlertDialogTrigger asChild>
            <Button disabled={!canSubmit} className='w-[60%]'>
              Criar
            </Button>
          </AlertDialogTrigger>
        </form>
      </section>
      <Confirmation handleSubmit={submitChampionship} />
    </AlertDialog>
  );
}
