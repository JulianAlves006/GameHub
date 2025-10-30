import React, { useEffect, useState } from 'react';
import { Container, Title, Form } from '../../../style';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectedItems } from './styled';
import Loading from '../../../components/loading';
import { FaTrashAlt, FaTimesCircle } from 'react-icons/fa';

export default function EditChampionship() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [awards, setAwards] = useState<any[]>([]);
  const [awardsOfChampionship, setAwardsOfChampionship] = useState<
    {
      id: number;
      description: string;
      awardsChampionships: any;
      uniqueIndex: number;
    }[]
  >([]);
  const [selectedAwards, setSelectedAwards] = useState<
    { id: number; description: string; uniqueIndex: number }[]
  >([]);
  const [awardsToDelete, setAwardsToDelete] = useState<number[]>([]);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : navigate('/home');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (user.profile !== 'admin') {
      toast.error('Somente usuários administradores podem editar campeonatos');
      navigate('/championships');
    }

    async function getChampionship() {
      setLoading(true);
      try {
        const { data } = await api.get(`/championship?idChampionship=${id}`);
        setName(data[0].name);
        const awardsChampionships = data[0].awardsChampionships;
        const awards = awardsChampionships.map(aC => ({
          id: aC.award.id,
          description: aC.award.description,
          awardsChampionships: aC.id,
          uniqueIndex: Date.now() + Math.random(), // Índice único para prêmios existentes
        }));
        setAwardsOfChampionship(awards);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.error || 'Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
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

    getChampionship();
    getAwards();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const description = e.target.options[e.target.selectedIndex].text;
    const uniqueIndex = Date.now() + Math.random(); // Índice único baseado em timestamp + random

    setSelectedAwards(prev => [...prev, { id, description, uniqueIndex }]);
    setAwardsOfChampionship(prev => [
      ...prev,
      { id, description, awardsChampionships: false, uniqueIndex },
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

      console.log(selectedAwards);
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
    } catch (error: any) {
      toast.error(error.response.data.error || 'Erro ao editar campeonato');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    index: number,
    award: { id: number; description: string; awardsChampionships: number }
  ) {
    // Remove do awardsOfChampionship pelo índice
    setAwardsOfChampionship(prev => prev.filter((_, i) => i !== index));

    // Remove do selectedAwards também pelo índice
    setSelectedAwards(prev => prev.filter((_, i) => i !== index));
    setAwardsToDelete(prev => [...prev, award.awardsChampionships]);
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
        <select name='award' id='award' onChange={handleChange}>
          <option value={0}>Premios</option>
          {awards.map(award => (
            <option key={award.id} value={award.id}>
              {award.description}
            </option>
          ))}
        </select>
        <SelectedItems>
          {awardsOfChampionship.map((sA, index) => (
            <p key={sA.uniqueIndex}>
              {sA.description}{' '}
              {sA.awardsChampionships ? (
                <FaTrashAlt
                  style={{ marginLeft: '15px', cursor: 'pointer' }}
                  onClick={() => handleDelete(index, sA)}
                />
              ) : (
                <FaTimesCircle
                  style={{ marginLeft: '15px', cursor: 'pointer' }}
                  onClick={() => handleRemoveNewAward(sA.uniqueIndex)}
                />
              )}
            </p>
          ))}
        </SelectedItems>
        <button>Editar</button>
      </Form>
    </Container>
  );
}
