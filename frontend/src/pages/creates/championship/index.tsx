import React, { useEffect, useState } from 'react';
import { Container, Title, Form } from '../../../style';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../../components/Alert';
import Loading from '../../../components/loading';
import AwardSelector from '../../../components/AwardSelector';
import type { Award } from '../../../types/types';
import { useApp } from '../../../contexts/AppContext';

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
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getAwards();
  }, []);

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
        <AwardSelector
          awards={awards}
          selectedAwards={selectedAwards}
          onAwardSelect={handleAwardSelect}
          onAwardRemove={handleAwardRemove}
          onNewAwardRemove={handleNewAwardRemove}
          placeholder='Selecionar prêmios'
        />
        <button>Criar</button>
      </Form>
      <Alert text='ATENÇÃO: Assim que clicar em criar, o seu campeonato automaticamente irá aparecer na lista de campeonatos' />
    </Container>
  );
}
