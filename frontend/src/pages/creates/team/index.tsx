import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/axios';
import Loading from '../../../components/loading';
import FileInput from '../../../components/FileInput';
import { useApp } from '../../../contexts/AppContext';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function TeamRegister() {
  const ctx = useApp();
  const navigate = useNavigate();
  const user = ctx.user;
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.profile === 'admin') {
      toast.error('Você não possui permissão para acessar essa pagina');
      navigate('/home');
    } else if ((user?.gamers?.[0]?.score ?? 0) < 50000) {
      toast.error(
        'Somente gamers com mais de 50.000 pontos de score podem criar times.'
      );
      navigate('/home');
    }
    verifyUserTeam();
  }, []);

  async function verifyUserTeam() {
    setLoading(true);
    try {
      const { data } = await api.get(`/team?idAdmin=${user?.gamers?.[0]?.id}`);
      if (data.teams.length > 0) {
        toast.error('Seu usuário já possui um time cadastrado.');
        navigate('/home');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao verificar time');
      } else {
        toast.error('Erro ao verificar time');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !logo) {
      toast.error('Todas as informações precisam estar preenchidas!');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('logo', logo);
      fd.append('name', name);

      const { data } = await api.post('/team', fd);
      toast.success('Time criado com sucesso! Boa sorte nessa nova jornada!');
      navigate(`/team/${data?.id}`);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Erro ao criar time');
      } else {
        toast.error('Erro ao criar time');
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
      <h1 className='text-4xl font-bold my-8 text-foreground'>Criar time</h1>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex flex-col items-center w-full max-w-2xl mx-auto',
          'border border-border rounded-xl p-6 shadow-lg',
          'bg-card text-card-foreground gap-4'
        )}
      >
        <Input
          type='text'
          placeholder='Nome do time'
          value={name}
          onChange={e => setName(e.target.value)}
          className='w-[60%]'
        />
        <FileInput
          id='logo'
          name='logo'
          accept='image/*'
          value={logo}
          onChange={setLogo}
          label='Logo do Time'
          placeholder='Selecionar logo do time'
          maxSize={5}
        />
        <Button type='submit' className='w-[60%]'>
          Criar time
        </Button>
      </form>
    </section>
  );
}
