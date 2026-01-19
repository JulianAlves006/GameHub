import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';
import { Table } from '../../components/Table';
import { Title } from '../../style';
import { Container, Right } from '../../style';
import api from '../../services/axios';
import { useApp } from '../../contexts/AppContext';
import type { Gamer, Team } from '../../types/types';
type TeamResponse = {
  teams: Team[];
};

export default function Home() {
  const navigate = useNavigate();
  const ctx = useApp();
  const [teams, setTeams] = useState<
    { id: number; name: string; gamer: string; score: number }[]
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('token') || !ctx.user) {
      toast.error('Você precisa estar logado para poder acessar essa pagina.');
      navigate('/');
    }
    async function getTeams() {
      setLoading(true);
      try {
        const { data } = await api.get<TeamResponse>(`/team?page=${page}`);
        const teamsData = data.teams.map(team => {
          if ((team?.gamers?.length ?? 0) <= 0)
            return {
              id: team.id,
              name: team.name,
              gamer: 'Nenhum jogador cadastrado',
              score: 0,
            };
          const teamScore = (team.gamers ?? []).reduce(
            (sum: number, g: Gamer) => sum + (Number(g?.score) || 0),
            0
          );

          const gamerData = team?.gamers?.reduce((max, current) =>
            current.score > max.score ? current : max
          );

          return {
            id: team.id,
            name: team.name,
            gamer: gamerData?.user?.name || 'Jogador não encontrado',
            score: teamScore,
          };
        });
        const OrderedTeams = teamsData.sort((a, b) =>
          a.score > b.score ? -1 : 1
        );
        setTeams(OrderedTeams);
      } catch (error: any) {
        toast.error(error.response.data.error || 'Erro');
      } finally {
        setLoading(false);
      }
    }

    getTeams();
  }, [navigate, page]);

  const config = [
    { key: 'position', label: 'Posição', element: 'tr' },
    { key: 'logo', label: 'Logo', element: 'tr' },
    {
      key: 'name',
      label: 'Nome',
      element: 'link',
      content: true,
      linkDirection: 'team',
      linkContent: 'id',
    },
    { key: 'gamer', label: 'Melhor jogador', element: 'tr' },
    { key: 'score', label: 'Score do time', element: 'tr' },
  ];

  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Ranking de times</Title>
      <Table config={config} data={teams} isTeams={true} currentPage={page} />
      <Right className='pages'>
        <button onClick={() => setPage(1)}>1</button>
        <button onClick={() => setPage(2)}>2</button>
        <button onClick={() => setPage(3)}>3</button>
        <button onClick={() => setPage(4)}>4</button>
        <button onClick={() => setPage(5)}>5</button>
      </Right>
    </Container>
  );
}
