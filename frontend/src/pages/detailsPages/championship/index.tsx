import { useEffect, useState } from 'react';
import { Center, Container, Left, Title } from '../../../style';
import api from '../../../services/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Admin,
  Awards,
  PrizeBadge,
  PrizeCard,
  PrizeDesc,
  PrizeGrid,
  PrizeTitle,
  Teams,
  TeamsContent,
  MatchesSection,
  MatchesHeader,
  MatchesList,
  MatchCard,
  MatchContent,
  MatchTeam,
  MatchLogo,
  MatchTeamName,
  MatchVS,
  TeamsHeader,
  TeamsList,
  TeamItem,
  EmptyState,
  AddMatchButton,
} from './styled';
import Loading from '../../../components/loading';
import { getUser } from '../../../services/utils';

export default function Championship() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [championship, setChampionship] = useState();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [awards, setAwards] = useState([]);
  const user = getUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getChampionship() {
      setLoading(true);
      try {
        const { data } = await api.get(`/championship?idChampionship=${id}`);
        setChampionship(data);
        if (data[0].matches.length > 0) {
          setMatches(data[0].matches);
          addUniqueTeamsFromMatches(data[0].matches);
        }
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    async function getAwards() {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/awardChampionship?idChampionship=${id}`
        );
        setAwards(data);
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }

    getChampionship();
    getAwards();
  }, []);

  function addUniqueTeamsFromMatches(matches: any[]) {
    setTeams(prev => {
      const seen = new Set(prev.map(t => t.id));
      const next = [...prev];

      for (const m of matches) {
        for (const team of [m.team1, m.team2]) {
          if (!seen.has(team.id)) {
            seen.add(team.id);
            next.push(team);
          }
        }
      }
      return next;
    });
  }
  return (
    <Container>
      {user.profile === 'admin' && (
        <Left>
          <Link
            style={{ marginTop: '10px' }}
            to={`/editChampionship/${championship?.[0].id}`}
          >
            Editar campeonato
          </Link>
        </Left>
      )}
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>{championship?.[0].name}</Title>
      <TeamsContent>
        <MatchesSection>
          <MatchesHeader>
            <h1>Partidas</h1>
            {user.profile === 'admin' && (
              <AddMatchButton to={`/createMatch/${championship?.[0].id}`}>
                Adicionar partidas
              </AddMatchButton>
            )}
          </MatchesHeader>
          <MatchesList>
            {matches?.length > 0 ? (
              matches.map((m, index) => (
                <MatchCard
                  key={m.id || index}
                  onClick={() => navigate(`/match/${m.id}`)}
                >
                  <MatchContent>
                    <MatchTeam>
                      <MatchLogo
                        src={`http://localhost:3333/team/${m.team1.id}/logo`}
                        alt={`${m.team1.name} logo`}
                        onError={e => (e.currentTarget.style.display = 'none')}
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/team/${m.team1.id}`);
                        }}
                      />
                      <MatchTeamName>{m.team1.name}</MatchTeamName>
                    </MatchTeam>
                    <MatchVS>
                      <span>VS</span>
                    </MatchVS>
                    <MatchTeam className='right'>
                      <MatchLogo
                        src={`http://localhost:3333/team/${m.team2.id}/logo`}
                        alt={`${m.team2.name} logo`}
                        onError={e => (e.currentTarget.style.display = 'none')}
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/team/${m.team2.id}`);
                        }}
                      />
                      <MatchTeamName>{m.team2.name}</MatchTeamName>
                    </MatchTeam>
                  </MatchContent>
                </MatchCard>
              ))
            ) : (
              <EmptyState>
                <p>Nenhuma partida cadastrada</p>
              </EmptyState>
            )}
          </MatchesList>
        </MatchesSection>
        <Teams>
          <TeamsHeader>
            <h1>Times</h1>
            <hr />
          </TeamsHeader>
          <TeamsList>
            {teams.length > 0 ? (
              teams.map((t, idx) => (
                <TeamItem key={t.id ?? idx} to={`/team/${t.id}`}>
                  <h3>{t.name}</h3>
                </TeamItem>
              ))
            ) : (
              <EmptyState>
                <p>Nenhum time cadastrado</p>
              </EmptyState>
            )}
          </TeamsList>
        </Teams>
      </TeamsContent>
      <Awards>
        <Center>
          <h1>Premios</h1>
        </Center>
        <PrizeGrid>
          {awards.length > 0 ? (
            awards.map((a, i) => (
              <PrizeCard key={i}>
                <PrizeBadge aria-hidden>🏆</PrizeBadge>
                <PrizeTitle>{a.award.description}</PrizeTitle>
                {a.award.others && <PrizeDesc>{a.award.others}</PrizeDesc>}
              </PrizeCard>
            ))
          ) : (
            <Center>Nenhum premio cadastrado</Center>
          )}
        </PrizeGrid>
      </Awards>
      <Admin>
        <Center>
          <h2>Criador: {championship?.[0].admin.name}</h2>
        </Center>
      </Admin>
    </Container>
  );
}
