import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../../../services/axios';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

export default function Awards() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [others, setOthers] = useState('');
  const [value, setValue] = useState(0);
  const [medal, setMedal] = useState(0);
  const [trophy, setTrophy] = useState(0);

  function handleTypeChange(selectedType: string) {
    // Resetar todos para 0
    setValue(0);
    setMedal(0);
    setTrophy(0);

    // Definir o tipo selecionado
    setType(selectedType);

    // Ativar o campo correspondente
    if (selectedType === 'value') {
      setValue(1);
    } else if (selectedType === 'medal') {
      setMedal(1);
    } else if (selectedType === 'trophy') {
      setTrophy(1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !type || !others) {
      toast.error('Todos os dados devem estar preenchidos!');
      return;
    }
    try {
      await api.post('/award', {
        description,
        value,
        medal,
        trophy,
        others,
      });
      toast.success('Premio criado com sucesso!');
      // Resetar o formulário
      setDescription('');
      setType('');
      setOthers('');
      setValue(0);
      setMedal(0);
      setTrophy(0);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Erro ao criar premio';
      toast.error(errorMessage);
    }
  }

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4'>
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
      <h1 className='text-4xl font-bold my-8 text-foreground'>Criar premios</h1>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex flex-col items-center w-full max-w-2xl mx-auto',
          'border border-border rounded-xl p-6 shadow-lg',
          'bg-card text-card-foreground gap-4'
        )}
      >
        <h2 className='text-2xl font-semibold mb-2'>Premio</h2>
        <div className='flex flex-col gap-2 w-[60%]'>
          <Label htmlFor='description'>Descrição</Label>
          <Input
            id='description'
            type='text'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-2 w-[60%]'>
          <Label htmlFor='type'>Tipo</Label>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Selecione o tipo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='value'>Valor</SelectItem>
              <SelectItem value='trophy'>Troféu</SelectItem>
              <SelectItem value='medal'>Medalha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-2 w-[60%]'>
          <Label htmlFor='others'>Outros (Observações ou detalhes)</Label>
          <Input
            id='others'
            type='text'
            value={others}
            onChange={e => setOthers(e.target.value)}
          />
        </div>
        <Button type='submit' className='w-[60%]'>
          Enviar
        </Button>
      </form>
    </section>
  );
}
