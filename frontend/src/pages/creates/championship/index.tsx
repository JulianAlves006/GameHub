import React, { useEffect, useState } from 'react';
import { Container, Title, Form } from '../../../style';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../../components/Alert';
import { SelectedItems } from './styled';
import Loading from '../../../components/loading';

export default function CreateChampionship() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [awards, setAwards] = useState<any[]>([]);
  const [endDate, setEndDate] = useState('');
  const [selectedAwards, setSelectedAwards] = useState<
    { id: number; description: string }[]
  >([]);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : navigate('/home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.profile !== 'admin') {
      toast.error(
        'Somente usuários administradores podem adicionar novos campeonatos'
      );
      navigate('/championships');
    }
    async function getAwards() {
      setLoading(true);
      try {
        const { data } = await api.get(`/award?id=${user.id}`);
        setAwards(data);
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getAwards();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const description = e.target.options[e.target.selectedIndex].text;

    setSelectedAwards(prev => [...prev, { id, description }]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Criação de campeonatos</Title>
      <Form onSubmit={handleSubmit}>
        <h1>Campeonato</h1>
        <input
          type='text'
          value={name}
          placeholder='Nome do seu campeonato'
          onChange={e => setName(e.target.value)}
        />
        <label htmlFor='date'>
          Data de inicio
          <input
            type='date'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
        <label htmlFor='date'>
          Data de término
          <input
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
        <select name='award' id='award' onChange={handleChange}>
          <option value={0}>Premios</option>
          {awards.map(award => (
            <option key={award.id} value={award.id}>
              {award.description}
            </option>
          ))}
        </select>
        <SelectedItems>
          {selectedAwards.map(sA => (
            <p>{sA.description}</p>
          ))}
        </SelectedItems>
        <button>Criar</button>
      </Form>
      <Alert text='ATENÇÃO: Assim que clicar em criar, o seu campeonato automaticamente irá aparecer na lista de campeonatos' />
    </Container>
  );
}
