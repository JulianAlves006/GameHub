import { useEffect, useState } from 'react';
import { Container, Right, Title } from '../../style';
import Loading from '../../components/loading';
import { toast } from 'react-toastify';
import api from '../../services/axios';
import { Table } from '../../components/Table';

export default function Gamers() {
  const [loading, setLoading] = useState(false);
  const [gamers, setGamers] = useState([]);
  const [page, setPage] = useState(1);

  const config = [
    { key: 'position', label: 'Posição', element: 'tr' },
    {
      key: 'name',
      label: 'Nome',
      element: 'link',
      content: true,
      linkDirection: 'user',
      linkContent: 'userID',
    },
    { key: 'shirtNumber', label: 'Numero da camiseta', element: 'tr' },
    {
      key: 'team',
      label: 'Time',
      element: 'link',
      content: true,
      linkDirection: 'team',
      linkContent: 'teamID',
    },
    { key: 'bestMetric', label: 'Melhor métrica', element: 'tr' },
    { key: 'score', label: 'Score do jogador', element: 'tr' },
  ];

  useEffect(() => {
    async function getGamers() {
      try {
        setLoading(true);
        const { data } = await api.get(`/gamer?page=${page}&limit=10`);
        const formatedGamers = data.gamers.map((gamer: any) => {
          const bestMetric = adjustMetrics(gamer.metrics || []);
          const metricLabel =
            bestMetric.type && bestMetric.quantity > 0
              ? `${bestMetric.quantity} ${bestMetric.type}${
                  bestMetric.quantity > 1 ? 's' : ''
                }`
              : 'Nenhuma métrica';

          return {
            id: gamer.id,
            userID: gamer.user?.id,
            name: gamer.user?.name || 'Nome não encontrado',
            score: gamer.score || 0,
            bestMetric: metricLabel,
            teamID: gamer?.team?.id || null,
            team: gamer?.team?.name || 'Nenhum time no momento',
            shirtNumber: gamer.shirtNumber,
          };
        });
        setGamers(formatedGamers);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao carregar gamers');
      } finally {
        setLoading(false);
      }
    }
    getGamers();
  }, [page]);

  function adjustMetrics(metrics: any[]) {
    if (!metrics || metrics.length === 0) {
      return { type: null, quantity: 0 };
    }

    // Agrupa por tipo e soma as quantidades
    const metricsByType: Record<string, number> = {};

    metrics.forEach(metric => {
      const type = metric.type;
      if (type) {
        metricsByType[type] =
          (metricsByType[type] || 0) + (metric.quantity || 0);
      }
    });

    // Encontra o tipo com maior quantidade
    let maxType = null;
    let maxQuantity = 0;

    Object.entries(metricsByType).forEach(([type, quantity]) => {
      if (quantity > maxQuantity) {
        maxQuantity = quantity;
        maxType = type;
      }
    });

    return { type: maxType, quantity: maxQuantity };
  }
  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Container>
        <Title>Ranking de jogadores</Title>
        <Table
          config={config}
          data={gamers}
          isTeams={true}
          currentPage={page}
        />
        <Right className='pages'>
          <button onClick={() => setPage(1)}>1</button>
          <button onClick={() => setPage(2)}>2</button>
          <button onClick={() => setPage(3)}>3</button>
          <button onClick={() => setPage(4)}>4</button>
          <button onClick={() => setPage(5)}>5</button>
        </Right>
      </Container>
    </>
  );
}
