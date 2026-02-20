import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import api from '../../../services/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Loading from '../../../components/loading';
import { useApp } from '../../../contexts/AppContext';
import {
  type Team,
  type Match,
  type Championship as ChampionshipType,
  type Award,
} from '../../../types/types';
import { isAxiosError } from 'axios';
import withoutLogo from '../../../assets/withoutLogo.png';

type AwardResponse = {
  award: Award;
};

export default function Championship() {
  const ctx = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [championship, setChampionship] = useState<ChampionshipType[]>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [awards, setAwards] = useState<AwardResponse[]>([]);
  const user = ctx.user;
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
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro');
        } else {
          toast.error('Erro');
        }
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
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'Erro');
        } else {
          toast.error('Erro');
        }
      } finally {
        setLoading(false);
      }
    }

    getChampionship();
    getAwards();
  }, [id]);

  function addUniqueTeamsFromMatches(matchList: Match[]) {
    setTeams(prev => {
      const seen = new Set(prev.map(t => t.id));
      const next = [...prev];

      for (const m of matchList) {
        for (const team of [m.team1, m.team2]) {
          if (team && team.id && !seen.has(team.id)) {
            seen.add(team.id);
            next.push(team);
          }
        }
      }
      return next;
    });
  }

  return (
    <section className='flex flex-col items-center w-full min-h-screen p-4 pb-24'>
      {user?.profile === 'admin' &&
        user?.id === championship?.[0]?.admin?.id && (
          <div className='w-[90%] flex justify-start'>
            <Link
              to={`/editChampionship/${championship?.[0]?.id}`}
              className='mt-2.5 text-primary hover:text-primary/70 transition-colors'
            >
              Editar campeonato
            </Link>
          </div>
        )}
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <h1 className='text-4xl font-bold my-8 text-foreground'>
        {championship?.[0]?.name}
      </h1>

      {/* Teams Content */}
      <div
        className={cn(
          'flex justify-between items-start w-[90%] max-w-[1400px] gap-8 mx-auto my-6',
          'max-lg:flex-col max-lg:max-w-[720px]'
        )}
      >
        {/* Matches Section */}
        <section className='flex-1 min-w-0 flex flex-col w-full'>
          <div className='flex flex-col gap-4 pr-20'>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold m-0 text-foreground'>
                Partidas
              </h2>
              {user?.profile === 'admin' && (
                <Link
                  to={`/createMatch/${championship?.[0]?.id}`}
                  className={cn(
                    'px-5 py-2.5 bg-primary/10 rounded-lg',
                    'border border-primary/30 no-underline text-foreground',
                    'font-medium transition-all whitespace-nowrap flex-shrink-0',
                    'hover:bg-primary/20 hover:border-secondary hover:-translate-y-0.5',
                    'max-md:w-full max-md:text-center'
                  )}
                >
                  Adicionar partidas
                </Link>
              )}
            </div>
            {matches?.length > 0 ? (
              matches.map((m, index) => (
                <div
                  key={m.id || index}
                  onClick={() => navigate(`/match/${m.id}`)}
                  className={cn(
                    'w-full mx-auto bg-card text-card-foreground',
                    'border border-border rounded-xl p-5 shadow-md m-0',
                    'cursor-pointer transition-all',
                    'hover:-translate-y-0.5 hover:shadow-lg hover:border-secondary'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-between gap-5',
                      'max-md:gap-3'
                    )}
                  >
                    {m.team1 && (
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <img
                          src={`${ctx.apiURL}/team/${m.team1.id}/logo`}
                          alt={`${m.team1.name} logo`}
                          onError={e => {
                            e.currentTarget.src = withoutLogo;
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/team/${m?.team1?.id}`);
                          }}
                          className={cn(
                            'w-[70px] h-[70px] object-cover rounded-xl',
                            'border-2 border-primary shadow-md',
                            'transition-transform hover:scale-105 flex-shrink-0',
                            'max-md:w-[50px] max-md:h-[50px]'
                          )}
                        />
                        <span className='text-lg font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis'>
                          {m.team1.name}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        'flex flex-col items-center gap-2 px-4 min-w-[80px] flex-shrink-0',
                        'max-md:min-w-[50px] max-md:px-2'
                      )}
                    >
                      <span className='text-sm font-bold text-primary tracking-widest max-md:text-xs max-md:tracking-wide'>
                        VS
                      </span>
                    </div>
                    {m.team2 && (
                      <div className='flex items-center gap-3 flex-1 min-w-0 flex-row-reverse text-right'>
                        <img
                          src={`${ctx.apiURL}/team/${m.team2.id}/logo`}
                          alt={`${m.team2.name} logo`}
                          onError={e => {
                            e.currentTarget.src = withoutLogo;
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/team/${m?.team2?.id}`);
                          }}
                          className={cn(
                            'w-[70px] h-[70px] object-cover rounded-xl',
                            'border-2 border-primary shadow-md',
                            'transition-transform hover:scale-105 flex-shrink-0',
                            'max-md:w-[50px] max-md:h-[50px]'
                          )}
                        />
                        <span className='text-lg font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis'>
                          {m.team2.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-10 text-muted-foreground'>
                <p className='text-base m-0'>Nenhuma partida cadastrada</p>
              </div>
            )}
          </div>
        </section>

        {/* Teams Section */}
        <div
          className={cn(
            'w-full min-w-[280px] max-w-[400px]',
            'bg-card text-card-foreground border border-border rounded-xl p-6 shadow-md'
          )}
        >
          <div className='mb-5'>
            <h2 className='text-3xl font-bold m-0 text-foreground'>Times</h2>
            <hr className='mt-3 border-none border-t-2 border-secondary/30' />
          </div>
          <div className='flex flex-col gap-3'>
            {teams.length > 0 ? (
              teams.map((t, idx) => (
                <Link
                  key={t.id ?? idx}
                  to={`/team/${t.id}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3',
                    'bg-primary/5 border border-primary/20 rounded-lg',
                    'no-underline text-foreground transition-all',
                    'hover:bg-primary/15 hover:border-secondary hover:translate-x-1'
                  )}
                >
                  <h3 className='m-0 text-lg font-medium text-foreground'>
                    {t.name}
                  </h3>
                </Link>
              ))
            ) : (
              <div className='text-center py-10 text-muted-foreground'>
                <p className='text-base m-0'>Nenhum time cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <section className='flex flex-col w-[90%] my-12'>
        <div className='flex-1 flex justify-center items-center'>
          <h2 className='text-3xl font-bold'>Premios</h2>
        </div>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 w-full'>
          {awards.length > 0 ? (
            awards.map((a, i) => (
              <div
                key={i}
                className={cn(
                  'mt-2.5 bg-linear-to-b from-card to-background',
                  'border border-border rounded-xl p-4 relative overflow-hidden',
                  'transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-secondary'
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl grid place-items-center text-2xl select-none',
                    'bg-linear-to-r from-primary to-secondary shadow-inner'
                  )}
                >
                  🏆
                </div>
                <h3 className='mt-2.5 mb-1.5 text-lg font-bold text-foreground'>
                  {a.award.description}
                </h3>
                {a.award.others && (
                  <p className='mt-1.5 text-sm text-muted-foreground leading-tight'>
                    {a.award.others}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className='flex-1 flex justify-center items-center'>
              Nenhum premio cadastrado
            </div>
          )}
        </div>
      </section>

      {/* Admin Section */}
      <section
        className={cn(
          'fixed bottom-0 left-0 right-0 flex flex-col w-full',
          'bg-background p-5 z-50 border-t border-border'
        )}
      >
        <div className='flex-1 flex justify-center items-center'>
          <h3 className='text-lg font-medium'>
            Criador: {championship?.[0]?.admin?.name}
          </h3>
        </div>
      </section>
    </section>
  );
}
