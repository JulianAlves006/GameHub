import { useEffect, useState } from 'react';
import Loading from '../../components/loading';
import { Title } from '../../style';
import { Container, Right } from '../../style';
import { Table } from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/axios';

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const id = window.location.search.replace('?', '');

  const statusFront = {
    playing: 'Jogando',
    pending: 'Pendente',
    finished: 'Finalizada',
  };

  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('user')) {
      toast.error('Você precisa estar logado para poder acessar essa pagina.');
      navigate('/');
    }
    async function getMatches() {
      setLoading(true);
      try {
        if (!id) {
          const { data } = await api.get(`/match?page=${page}`);
          let frontData;
          if (
            filter === 'finished' ||
            filter === 'playing' ||
            filter === 'pending'
          ) {
            frontData = data
              ?.filter(d => d.status === filter)
              .map(d => ({
                link: d.id,
                championship: d.championship.name,
                championshipId: d.championship.id,
                team1: d.team1.name,
                team2: d.team2.name,
                winner: d?.winner?.name ?? 'Indefinido',
                status: statusFront[d.status as keyof typeof statusFront],
              }));
          } else {
            frontData = data
              ?.filter(d => d.status !== 'finished')
              .map(d => ({
                link: d.id,
                championship: d.championship.name,
                championshipId: d.championship.id,
                team1Name: d.team1.name,
                team2Name: d.team2.name,
                team1Id: d.team1.id,
                team2Id: d.team2.id,
                winner: d?.winner?.name ?? 'Indefinido',
                status: statusFront[d.status as keyof typeof statusFront],
              }));
          }

          setMatches(frontData);
        } else {
          const { data } = await api.get(
            `/match?page=${page}&idChampionship=${id}`
          );
          let frontData;
          if (
            filter === 'finished' ||
            filter === 'playing' ||
            filter === 'pending'
          ) {
            frontData = data
              ?.filter(d => d.status === filter)
              .map(d => ({
                link: d.id,
                championship: d.championship.name,
                championshipId: d.championship.id,
                team1: d.team1.name,
                team2: d.team2.name,
                winner: d?.winner?.name ?? 'Indefinido',
                status: statusFront[d.status as keyof typeof statusFront],
              }));
          } else {
            frontData = data
              ?.filter(d => d.status !== 'finished')
              .map(d => ({
                link: d.id,
                championship: d.championship.name,
                championshipId: d.championship.id,
                team1: d.team1.name,
                team2: d.team2.name,
                winner: d?.winner?.name ?? 'Indefinido',
                status: statusFront[d.status as keyof typeof statusFront],
              }));
          }

          setMatches(frontData);
        }
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }
    getMatches();
  }, [filter, page]);

  const config = [
    {
      key: 'link',
      label: 'Partida',
      element: 'link',
      linkDirection: 'match',
    },
    {
      key: 'championship',
      label: 'Campeonato',
      element: 'link',
      content: true,
      linkContent: 'championshipId',
      linkDirection: 'championship',
    },
    {
      key: 'team1Name',
      label: 'Time 1',
      element: 'link',
      content: true,
      linkDirection: 'team',
      linkContent: 'team1Id',
    },
    {
      key: 'team2Name',
      label: 'Time 2',
      element: 'link',
      content: true,
      linkDirection: 'team',
      linkContent: 'team2Id',
    },
    {
      key: 'winner',
      label: 'Vencedor',
      element: 'tr',
    },
    {
      key: 'status',
      label: 'Status',
      element: 'tr',
    },
  ];
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Partidas</Title>
      <Right>
        <select
          className='filter'
          name='filter'
          id='filter'
          onChange={e => setFilter(e.target.value)}
        >
          <option value=''>Filtro</option>
          <option value='pending'>Pendentes</option>
          <option value='playing'>Jogando</option>
          <option value='finished'>Finalizadas</option>
        </select>
      </Right>
      <Table config={config} data={matches} />
      <Right>
        <button onClick={() => setPage(1)}>1</button>
        <button onClick={() => setPage(2)}>2</button>
        <button onClick={() => setPage(3)}>3</button>
        <button onClick={() => setPage(4)}>4</button>
        <button onClick={() => setPage(5)}>5</button>
      </Right>
    </Container>
  );
}
