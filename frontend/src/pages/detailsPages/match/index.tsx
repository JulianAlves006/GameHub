import { Link, useNavigate, useParams } from 'react-router-dom';
import { Center, Container, Left, Title } from '../../../style';
import { useEffect, useState } from 'react';
import api from '../../../services/axios';
import { toast } from 'react-toastify';
import {
  Card,
  Champ,
  Logo,
  Meta,
  Name,
  Pill,
  Row,
  Score,
  Team,
  PrizeGrid,
  PrizeCard,
  PrizeBadge,
  PrizeTitle,
  PrizeDesc,
  PillSelect,
  MetricsWrap,
  FormRow,
  Input,
  Select,
  TextArea,
  Button,
  MetricsList,
  MetricItem,
  MetricType,
  MetricQty,
  MetricDesc,
  EmptyState,
  MetricPlayer,
} from './styled';
import Loading from '../../../components/loading';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import { addScore, getUser } from '../../../services/utils';

export default function Match() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [match, setMatch] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [winner, setWinner] = useState('Indefinido');
  const [gamers, setGamers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const statusFront = {
    pending: `Pendente`,
    playing: `Jogando`,
    finished: `Finalizada`,
  };
  const user = getUser();
  // estados para o formulário de métricas
  const [metricType, setMetricType] = useState<string>('gol');
  const [metricQty, setMetricQty] = useState<number>(1);
  const [metricDesc, setMetricDesc] = useState<string>('');
  const [metricPlayerId, setMetricPlayerId] = useState<number | ''>('');

  // lista local de métricas (exibe as carregadas + as novas enviadas)
  const [metrics, setMetrics] = useState<
    { id?: number; type: string; quantity: number; description: string }[]
  >([]);

  // Tipos de métricas exibidos no Select
  const METRIC_TYPES = [
    'gol',
    'defesa',
    'falta',
    'chute ao gol',
    'assistencia',
    'cartao amarelo',
    'cartao vermelho',
  ];

  const SCORE_VALUES = {
    gol: 20,
    defesa: 15,
    falta: -3,
    'chute ao gol': 10,
    assistencia: 10,
    'cartao amarelo': 0,
    'cartao vermelho': -5,
  };

  useEffect(() => {
    async function getMatch() {
      setLoading(true);
      try {
        const { data } = await api.get(`/match?idMatch=${id}`);
        console.log(data);
        setMatch(data);
        setNewScore(data[0].scoreboard || '0 - 0');
        setWinner(data?.[0]?.winner?.name || 'Indefinido');
        // tenta puxar métricas do backend (se a API já retornar junto com a partida)
        if (Array.isArray(data?.[0]?.metrics)) {
          setMetrics(data[0].metrics);
        }
        // adiciona todos os gamers dos times 1 e 2 no estado gamers
        const team1Gamers = data?.[0]?.team1?.gamers || [];
        const team2Gamers = data?.[0]?.team2?.gamers || [];
        setGamers([...team1Gamers, ...team2Gamers]);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getMatch();
  }, []);

  async function handleEditWithStatus(status: string) {
    setLoading(true);
    try {
      await api.put(`/match`, {
        id: (match[0] as { id: number })?.id,
        status,
      });
      toast.success('Status da partida atualizado com sucesso');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao editar partida');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await api.delete(`/match`, {
        params: { id: match[0]?.id },
      });
      toast.success('Partida deletada com sucesso!');
      navigate('/matches');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao deletar partida');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newScore) {
      toast.error('Score não pode estar nulo. Coloque 0 - 0');
      return;
    }
    setLoading(true);
    try {
      await api.put('/match', {
        id: (match[0] as { id: number })?.id,
        scoreboard: newScore,
      });
      toast.success('Score editado com sucesso!');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao editar partida');
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }

  async function handleWinner(id: number) {
    if (!id) return;
    setLoading(true);
    try {
      await api.put('/match', {
        id: (match[0] as { id: number })?.id,
        winner: id,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao editar partida');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMetric(e?: React.FormEvent) {
    e?.preventDefault();
    if (!metricDesc?.trim()) {
      toast.error('Descrição é obrigatória.');
      return;
    }
    if (!metricType) {
      toast.error('Selecione um tipo.');
      return;
    }
    if (metricQty === null || metricQty === undefined || isNaN(metricQty)) {
      toast.error('Quantidade inválida.');
      return;
    }
    if (
      metricPlayerId === '' ||
      metricPlayerId === undefined ||
      metricPlayerId === null
    ) {
      toast.error('Selecione o jogador.');
      return;
    }

    setLoading(true);
    try {
      const body = {
        match: (match[0] as { id: number })?.id,
        type: metricType,
        quantity: Number(metricQty),
        description: metricDesc.trim(),
        gamer: Number(metricPlayerId), // 👈 novo
      };

      const { data } = await api.post('/metric', body);

      // busca o gamer completo no estado gamers pelo ID retornado
      const gamerFound = gamers.find(g => g.id === data?.gamer);

      const created = {
        ...data,
        gamer: gamerFound || null,
      };

      setMetrics(prev => [created, ...prev]);

      // limpa formulário
      setMetricType('gol');
      setMetricQty(1);
      setMetricDesc('');
      setMetricPlayerId('');
      addScore(
        SCORE_VALUES[metricType as keyof typeof SCORE_VALUES] * metricQty,
        metricPlayerId
      );
      toast.success('Métrica adicionada com sucesso!');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro ao adicionar métrica');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      {user.id === match?.[0]?.championship?.admin?.id && (
        <Left>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '5%',
              marginTop: '10px',
              position: 'absolute',
            }}
          >
            <FaTrashAlt
              size={20}
              style={{
                cursor: 'pointer',
              }}
              onClick={handleDelete}
            />
          </div>
        </Left>
      )}
      {match.length > 0 ? (
        <>
          <Title>
            {match[0]?.team1?.name || 'Não encontrado'} x{' '}
            {match[0]?.team2?.name || 'Não encontrado'}
          </Title>
          <Card>
            <Meta>
              {user.id === match?.[0].championship?.admin?.id ? (
                <PillSelect
                  onChange={e => {
                    const status = e.target.value;
                    if (status) {
                      handleEditWithStatus(status);
                    }
                  }}
                >
                  <option value=''>
                    {
                      statusFront[
                        (match[0]?.status as keyof typeof statusFront) ??
                          'pending'
                      ]
                    }
                  </option>
                  {Object.entries(statusFront)
                    .filter(([key]) => key !== match[0]?.status)
                    .map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                </PillSelect>
              ) : (
                <Pill>
                  {
                    statusFront[
                      (match[0]?.status as keyof typeof statusFront) ??
                        'pending'
                    ]
                  }
                </Pill>
              )}

              <Champ>
                <Link to={`/championship/${match[0]?.championship.id}`}>
                  {match[0]?.championship.name}
                </Link>
              </Champ>
            </Meta>

            <Row>
              {match[0].team1 && (
                <Team>
                  {match[0].team1.logo && (
                    <Logo
                      src={`http://localhost:3333/team/${match[0].team1.id}/logo`}
                      alt={match[0].team1.name}
                      onClick={() => navigate(`/team/${match[0].team1.id}`)}
                    />
                  )}
                  <Name>
                    <Link to={`/team/${match[0].team1.id}`}>
                      {match[0].team1.name}
                    </Link>
                  </Name>
                </Team>
              )}

              <Score>
                {isEditing ? (
                  user.id === match?.[0]?.championship?.admin?.id && (
                    <>
                      <input
                        type='text'
                        value={newScore}
                        onChange={e => setNewScore(e.target.value)}
                      />
                      <FaCheck
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAdd()}
                      />
                    </>
                  )
                ) : (
                  <h1
                    onClick={() => {
                      if (user.id === match?.[0]?.championship?.admin?.id) {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {newScore}
                  </h1>
                )}
              </Score>

              {match[0].team2 && (
                <Team className='right'>
                  <Name>
                    <Link to={`/team/${match[0].team2.id}`}>
                      {match[0].team2.name}
                    </Link>
                  </Name>
                  {match[0].team2.logo && (
                    <Logo
                      src={`http://localhost:3333/team/${match[0].team2.id}/logo`}
                      alt={match[0].team2.name}
                      onClick={() => navigate(`/team/${match[0].team2.id}`)}
                    />
                  )}
                </Team>
              )}
              {!match[0].winner &&
                winner === 'Indefinido' &&
                match[0].team1 &&
                match[0].team2 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '245%',
                    }}
                  >
                    <button
                      onClick={() => {
                        handleWinner(match[0].team1.id);
                        setWinner(match[0].team1.name);
                      }}
                    >
                      Definir time 1 vencedor
                    </button>
                    <button
                      onClick={() => {
                        handleWinner(match[0].team2.id);
                        setWinner(match[0].team2.name);
                      }}
                    >
                      Definir time 2 vencedor
                    </button>
                  </div>
                )}
            </Row>
            <Center>
              <h1>Vencedor</h1>
            </Center>
            <Center style={{ marginTop: '10px' }}>
              <h3>{winner}</h3>
            </Center>
          </Card>
          {/* ====== MÉTRICAS DA PARTIDA ====== */}
          <MetricsWrap>
            <Center>
              <h1>Métricas</h1>
            </Center>

            {user.id === match?.[0]?.championship?.admin?.id && (
              <form onSubmit={handleAddMetric}>
                <FormRow>
                  <Select
                    value={metricType}
                    onChange={e => setMetricType(e.target.value)}
                    aria-label='Tipo da métrica'
                  >
                    {METRIC_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type='number'
                    min={0}
                    step={1}
                    value={metricQty}
                    onChange={e => setMetricQty(Number(e.target.value))}
                    placeholder='Quantidade'
                    aria-label='Quantidade'
                  />

                  <TextArea
                    required
                    value={metricDesc}
                    onChange={e => setMetricDesc(e.target.value)}
                    placeholder='Descrição (obrigatório)'
                    aria-label='Descrição'
                    rows={2}
                  />
                  <Select
                    value={metricPlayerId}
                    onChange={e =>
                      setMetricPlayerId(
                        e.target.value ? Number(e.target.value) : ''
                      )
                    }
                    aria-label='Jogador'
                    required
                    disabled={!gamers.length}
                  >
                    <option value=''>
                      {gamers.length
                        ? 'Selecione o jogador'
                        : 'Carregando jogadores...'}
                    </option>
                    {gamers.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.user.name}
                      </option>
                    ))}
                  </Select>

                  <Button type='submit'>Adicionar</Button>
                </FormRow>
              </form>
            )}

            {/* Lista de métricas */}
            {metrics?.length ? (
              <MetricsList>
                {metrics.map((m, i) => (
                  <MetricItem key={m.id ?? i}>
                    <MetricType>{m.type}</MetricType>
                    <MetricPlayer>
                      {/* tenta usar m.playerName vindo do back; se não houver, resolve localmente */}
                      {m?.gamer?.user?.name}
                    </MetricPlayer>
                    <MetricQty>x{m.quantity}</MetricQty>
                    <MetricDesc>{m.description}</MetricDesc>
                  </MetricItem>
                ))}
              </MetricsList>
            ) : (
              <EmptyState>Nenhuma métrica cadastrada</EmptyState>
            )}
          </MetricsWrap>

          <Center>
            <h1>Premios</h1>
          </Center>
          <PrizeGrid>
            {match[0].championship?.awardsChampionships.length > 0 ? (
              match[0].championship?.awardsChampionships?.map((p, i) => (
                <PrizeCard key={i}>
                  <PrizeBadge aria-hidden>🏆</PrizeBadge>
                  <PrizeTitle>{p.award.description}</PrizeTitle>
                  {p.award.others && <PrizeDesc>{p.award.others}</PrizeDesc>}
                </PrizeCard>
              ))
            ) : (
              <Center>Nenhum premio cadastrado</Center>
            )}
          </PrizeGrid>
        </>
      ) : (
        <Title>Carregando</Title>
      )}
    </Container>
  );
}
