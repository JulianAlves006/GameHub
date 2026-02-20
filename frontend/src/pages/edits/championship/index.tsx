import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import api from '../../../services/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loading from '../../../components/loading';
import AwardSelector from '../../../components/AwardSelector';
import type { Award, AwardChampionship } from '../../../types/types';
import { useApp } from '../../../contexts/AppContext';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { isAxiosError } from 'axios';

export default function EditChampionship() {
  const navigate = useNavigate();
  const ctx = useApp();
  const [name, setName] = useState('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [awardsOfChampionship, setAwardsOfChampionship] = useState<
    {
      id: number;
      description: string;
      awardsChampionships?: boolean;
      awardsChampionshipsId?: number;
      uniqueIndex: number;
    }[]
  >([]);
  const [selectedAwards, setSelectedAwards] = useState<
    { id: number; description: string; uniqueIndex: number }[]
  >([]);
  const [awardsToDelete, setAwardsToDelete] = useState<number[]>([]);
  const user = ctx.user;
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (user?.profile !== 'admin') {
      toast.error('Somente usuários administradores podem editar campeonatos');
      navigate('/championships');
    }

    async function getChampionship() {
      setLoading(true);
      try {
        const { data } = await api.get(`/championship?idChampionship=${id}`);
        setName(data[0].name);
        const awardsChampionships = data[0].awardsChampionships;
        const awardsData = awardsChampionships.map((aC: AwardChampionship) => ({
          id: aC?.award?.id,
          description: aC?.award?.description,
          awardsChampionships: true,
          awardsChampionshipsId: aC.id,
          uniqueIndex: Date.now() + Math.random(), // Índice único para prêmios existentes
        }));
        setAwardsOfChampionship(awardsData);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro ao buscar dados');
        } else {
          toast.error('Erro ao buscar dados');
        }
      } finally {
        setLoading(false);
      }
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

    getChampionship();
    getAwards();
  }, [id, navigate, user?.id, user?.profile]);

  const handleAwardSelect = (award: {
    id: number;
    description: string;
    uniqueIndex?: number;
    awardsChampionships?: boolean;
  }) => {
    setSelectedAwards(prev => [
      ...prev,
      {
        id: award.id,
        description: award.description,
        uniqueIndex: award.uniqueIndex ?? Date.now() + Math.random(),
      },
    ]);
    setAwardsOfChampionship(prev => [
      ...prev,
      {
        id: award.id,
        description: award.description,
        uniqueIndex: award.uniqueIndex ?? Date.now() + Math.random(),
        awardsChampionships: award.awardsChampionships,
      },
    ]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name) {
        toast.error('Nome, data de inicio e data de fim são obrigatórios!');
        return;
      }

      const awardsSelectedsIDS = selectedAwards.map(sA => sA.id);

      if (awardsToDelete.length > 0) {
        await api.delete('/awardChampionship', {
          params: { id: awardsToDelete },
        });
      }
      await api.put('championship', {
        id,
        name,
        awards: awardsSelectedsIDS,
      });
      toast.success('Campeonato editado com sucesso!');
      navigate('/championships');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao editar campeonato');
      } else {
        toast.error('Erro ao editar campeonato');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    index: number,
    award: { id: number; description: string; awardsChampionshipsId?: number }
  ) {
    // Remove do awardsOfChampionship pelo índice
    setAwardsOfChampionship(prev => prev.filter((_, i) => i !== index));

    // Remove do selectedAwards também pelo índice
    setSelectedAwards(prev => prev.filter((_, i) => i !== index));
    if (award.awardsChampionshipsId) {
      setAwardsToDelete(prev => [...prev, award.awardsChampionshipsId!]);
    }
  }

  function handleRemoveNewAward(uniqueIndex: number) {
    // Remove apenas do awardsOfChampionship (prêmios novos que ainda não foram salvos)
    setAwardsOfChampionship(prev => {
      const filtered = prev.filter(award => award.uniqueIndex !== uniqueIndex);
      return filtered;
    });

    // Remove do selectedAwards também pelo uniqueIndex
    setSelectedAwards(prev => {
      const filtered = prev.filter(award => award.uniqueIndex !== uniqueIndex);
      return filtered;
    });
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
      <h1 className='text-4xl font-bold my-8 text-foreground'>
        Edição de campeonatos
      </h1>
      <form
        onSubmit={handleSubmit}
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
        <AwardSelector
          awards={awards}
          selectedAwards={awardsOfChampionship}
          onAwardSelect={handleAwardSelect}
          onAwardRemove={handleDelete}
          onNewAwardRemove={handleRemoveNewAward}
          placeholder='Selecionar prêmios'
        />
        <Button type='submit' className='w-[60%]'>
          Editar
        </Button>
      </form>
    </section>
  );
}
