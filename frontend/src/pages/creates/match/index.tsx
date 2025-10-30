import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Title } from '../../../style';
import { useEffect, useState } from 'react';
import api from '../../../services/axios';
import { toast } from 'react-toastify';
import { TeamsSelection } from './styled';
import Loading from '../../../components/loading';

export default function CreateMatch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [teamsFiltred1, setTeamsFiltred1] = useState([]);
  const [teamsFiltred2, setTeamsFiltred2] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!team1 || team1 === '') setTeamsFiltred1([]);
    if (!team2 || team2 === '') setTeamsFiltred2([]);
  }, [team1, team2]);

  async function handleSelect() {
    const { data } = await api.get(`/team`);
    setTeams(data.teams);
  }

  function handleChangeTeam1() {
    const norm2 = (s?: string) => (s ?? '').toLowerCase();
    setTeamsFiltred1(teams.filter(t => norm2(t.name).includes(norm2(team1))));
  }

  function handleSelectTeam1(id: number) {
    const selectedTeam = teams.find(t => t.id === id);
    if (selectedTeam) {
      setTeam1(selectedTeam);
      setTeamsFiltred1([]);
    }
  }

  function handleChangeTeam2() {
    const norm2 = (s?: string) => (s ?? '').toLowerCase();
    setTeamsFiltred2(teams.filter(t => norm2(t.name).includes(norm2(team2))));
  }

  function handleSelectTeam2(id: number) {
    const selectedTeam = teams.find(t => t.id === id);
    if (selectedTeam) {
      setTeam2(selectedTeam);
      setTeamsFiltred2([]);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!team1 || !team2 || !status || !id) {
      toast.error('Todos os campos precisam estar preenchidos');
      return;
    }
    setLoading(true);
    try {
      await api.post('/match', {
        team1: team1.id,
        team2: team2.id,
        championship: id,
        status,
      });
      toast.success('Partida criada com sucesso!');
      navigate(`/championship/${id}`);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Criar partida</Title>
      <Form onSubmit={handleSubmit}>
        <h1>Times e premios</h1>
        <input
          type='text'
          placeholder='Time 1'
          onSelect={handleSelect}
          value={team1.name}
          onChange={e => {
            setTeam1(e.target.value);
            handleChangeTeam1();
          }}
        />
        {teamsFiltred1.map(tF => (
          <TeamsSelection key={tF.id} onClick={() => handleSelectTeam1(tF.id)}>
            {tF.name}
          </TeamsSelection>
        ))}
        <input
          type='text'
          placeholder='Time 2'
          onSelect={handleSelect}
          value={team2.name}
          onChange={e => {
            setTeam2(e.target.value);
            handleChangeTeam2();
          }}
        />
        {teamsFiltred2.map(tF => (
          <TeamsSelection key={tF.id} onClick={() => handleSelectTeam2(tF.id)}>
            {tF.name}
          </TeamsSelection>
        ))}
        <select onChange={e => setStatus(e.target.value)}>
          <option value=''>Status</option>
          <option value='pending'>Pendente</option>
          <option value='playing'>Jogando</option>
          <option value='finished'>Finalizada</option>
        </select>
        <button>Enviar</button>
      </Form>
    </Container>
  );
}
