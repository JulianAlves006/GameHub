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
  const [shirtNumber, setShirtNumber] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa ter um usuário pra criar o jogador.');
      navigate('/register');
    }
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('gamer', { shirtNumber, user: user.id });
      toast.success('Gamer criado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      toast.error(error.response.data.error);
      navigate('/home');
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
          onChange={e => setShirtNumber(e.target.value)}
        />
        <button>Salvar</button>
      </Form>
    </Container>
  );
}
