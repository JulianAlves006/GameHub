import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../../services/axios';
import Loading from '../../../components/loading';
import { useApp } from '../../../contexts/AppContext';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function Gamer() {
  const ctx = useApp();
  const navigate = useNavigate();
  const user = ctx.user;
  const [shirtNumber, setShirtNumber] = useState<number | string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa ter um usuário pra criar o jogador.');
      navigate('/register');
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!shirtNumber || shirtNumber === '') {
      toast.error('Número da camiseta é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await api.post('gamer', {
        shirtNumber: Number(shirtNumber),
        user: user?.id,
      });
      toast.success('Gamer criado com sucesso!');
      navigate('/');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao criar jogador');
      } else {
        toast.error('Erro ao criar jogador');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4'>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <h1 className='text-4xl font-bold my-8 text-foreground'>Criar Jogador</h1>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex flex-col items-center w-full max-w-2xl mx-auto',
          'border border-border rounded-xl p-6 shadow-lg',
          'bg-card text-card-foreground gap-4'
        )}
      >
        <Input
          type='number'
          placeholder='Número de camiseta'
          value={shirtNumber}
          onChange={e =>
            setShirtNumber(e.target.value ? Number(e.target.value) : '')
          }
          min='1'
          max='99'
          required
          className='w-[60%]'
        />
        <Button type='submit' className='w-[60%]'>
          Salvar
        </Button>
      </form>
    </section>
  );
}
