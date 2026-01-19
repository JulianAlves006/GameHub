import { useEffect, useState } from 'react';
import Loading from '../../components/loading';
import { Title } from '../../style';
import { Container } from '../../style';
import { Table } from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/axios';
import {
  PageHeader,
  FilterSelect,
  PaginationContainer,
  PaginationButton,
  TableContainer,
} from './styled';
import { useApp } from '../../contexts/AppContext';

export default function Matches() {
  const navigate = useNavigate();
  const ctx = useApp();
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const id = window.location.search.replace('?', '');

  const statusFront = {
    playing: 'Jogando',
    pending: 'Pendente',
    finished: 'Finalizada',
  };

  useEffect(() => {
    if (!localStorage.getItem('token') || !ctx.user) {
      toast.error('Você precisa estar logado para poder acessar essa pagina.');
      navigate('/');
    }
    async function getMatches() {
      setLoading(true);
      try {
        const endpoint = id
          ? `/match?page=${page}&idChampionship=${id}`
          : `/match?page=${page}`;

        const { data } = await api.get(endpoint);

        let frontData;
        // Se houver filtro específico, aplicar filtro
        if (
          filter === 'finished' ||
          filter === 'playing' ||
          filter === 'pending'
        ) {
          frontData = data
            ?.filter((d: any) => d.status === filter)
            .map((d: any) => ({
              link: d.id,
              championship: d.championship.name,
              championshipId: d.championship.id,
              team1Name: d.team1?.name || 'Não definido',
              team2Name: d.team2?.name || 'Não definido',
              team1Id: d.team1?.id,
              team2Id: d.team2?.id,
              winner: d?.winner?.name ?? 'Indefinido',
              status: statusFront[d.status as keyof typeof statusFront],
            }));
        } else {
          // Sem filtro: mostrar apenas pendentes e jogando (não mostrar finalizadas)
          frontData = data
            ?.filter((d: any) => d.status !== 'finished')
            .map((d: any) => ({
              link: d.id,
              championship: d.championship.name,
              championshipId: d.championship.id,
              team1Name: d.team1?.name || 'Não definido',
              team2Name: d.team2?.name || 'Não definido',
              team1Id: d.team1?.id,
              team2Id: d.team2?.id,
              winner: d?.winner?.name ?? 'Indefinido',
              status: statusFront[d.status as keyof typeof statusFront],
            }));
        }

        setMatches(frontData || []);
        setTotalPages(Math.ceil((frontData?.length || 0) / 10));
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          onClick={() => setPage(i)}
          className={page === i ? 'active' : ''}
        >
          {i}
        </PaginationButton>
      );
    }

    return buttons;
  };
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}

      <Title>Partidas</Title>
      <PageHeader>
        <FilterSelect
          name='filter'
          id='filter'
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPage(1); // Resetar página ao mudar filtro
          }}
        >
          <option value=''>Todas as partidas</option>
          <option value='pending'>Pendentes</option>
          <option value='playing'>Jogando</option>
          <option value='finished'>Finalizadas</option>
        </FilterSelect>
      </PageHeader>

      <TableContainer>
        <Table config={config} data={matches} />
      </TableContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            «
          </PaginationButton>
          {generatePaginationButtons()}
          <PaginationButton
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            »
          </PaginationButton>
        </PaginationContainer>
      )}
    </Container>
  );
}
