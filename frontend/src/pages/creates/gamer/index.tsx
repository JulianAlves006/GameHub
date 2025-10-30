import { useEffect, useState } from 'react';
import { Container, Form, Title } from '../../../style';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import Loading from '../../../components/loading';

export default function Gamer() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const [shirtNumber, setShirtNumber] = useState<number | ''>('');
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
        user: user.id,
      });
      toast.success('Gamer criado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao criar jogador');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Criar Jogador</Title>
      <Form onSubmit={handleSubmit}>
        <input
          type='number'
          placeholder='Número de camiseta'
          value={shirtNumber}
          onChange={e =>
            setShirtNumber(e.target.value ? Number(e.target.value) : '')
          }
          min='1'
          max='99'
          required
        />
        <button>Salvar</button>
      </Form>
    </Container>
  );
}
