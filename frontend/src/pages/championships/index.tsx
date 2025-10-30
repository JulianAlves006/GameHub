import { useEffect, useState } from 'react';
import { Table } from '../../components/Table';
import { Container, Title } from '../../style';
import api from '../../services/axios';
import { toast } from 'react-toastify';
import { formatDateFullText } from '../../services/utils';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading';
import { PageHeader, FilterSelect, AddButton, TableContainer } from './styled';

export default function Championships() {
  const navigate = useNavigate();
  const [championships, setChampionships] = useState([]);
  const [filter, setFilter] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : navigate('/home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getChampionships() {
      setLoading(true);
      try {
        const { data } = await api.get('championship');
        let filtered;
        if (filter === '') {
          filtered = data.filter(d => d.endDate >= today);

          setChampionships(filtered);
        }
        if (filter === 'happening') {
          filtered = data.filter(
            d => d.endDate >= today && d.startDate <= today
          );

          setChampionships(filtered);
        }
        if (filter === 'pending') {
          filtered = data.filter(d => d.startDate > today);

          setChampionships(filtered);
        }
        if (filter === 'finished') {
          filtered = data.filter(d => d.endDate < today);

          setChampionships(filtered);
        }
        filtered.map(f => {
          Object.assign(f, {
            endDateText: formatDateFullText(f.endDate),
            startDateText: formatDateFullText(f.startDate),
          });
        });
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getChampionships();
  }, [filter]);

  const config = [
    {
      key: 'id',
      label: 'Partidas',
      element: 'filter',
      linkDirection: 'matches',
    },
    {
      key: 'name',
      label: 'Campeonato',
      element: 'link',
      content: true,
      linkContent: 'id',
      linkDirection: 'championship',
    },
    { key: 'startDateText', label: 'Inicio', element: 'tr' },
    { key: 'endDateText', label: 'Fim', element: 'tr' },
  ];
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}

      <Title>Campeonatos</Title>
      <PageHeader>
        {user.profile === 'admin' && (
          <AddButton onClick={() => navigate('/createChampionship')}>
            Adicionar Campeonato
          </AddButton>
        )}
        <FilterSelect
          name='filter'
          id='filter'
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value=''>Todos os campeonatos</option>
          <option value='pending'>Pendentes</option>
          <option value='happening'>Acontecendo</option>
          <option value='finished'>Finalizados</option>
        </FilterSelect>
      </PageHeader>

      <TableContainer>
        <Table config={config} data={championships} />
      </TableContainer>
    </Container>
  );
}
