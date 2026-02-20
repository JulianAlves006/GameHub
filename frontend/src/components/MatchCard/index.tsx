import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ChevronRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading';
import withoutLogo from '../../assets/withoutLogo.png';
import { useMemo, useState } from 'react';

type MatchCardProps = {
  data: {
    link: number;
    championship: string;
    championshipId: number;
    team1Name: string;
    team2Name: string;
    team1Id: number;
    team2Id: number;
    winner: string;
    status: string;
    scoreTeam1: number | null;
    scoreTeam2: number | null;
    date: string | null;
  };
  className?: string;
};

export default function MatchCard({ data, className }: MatchCardProps) {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Jogando':
        return 'bg-gold/10 text-gold border-gold/20';
      case 'Finalizada':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pendente':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formattedMatchDate = useMemo(() => {
    if (!data?.date || data.date === null) {
      return 'Data ainda não foi definida';
    }
    try {
      const date = new Date(data.date);
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data ainda não foi definida';
      }
      const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${formattedDate} às ${formattedTime}`;
    } catch {
      return 'Data ainda não foi definida';
    }
  }, [data.date]);

  return (
    <Card
      onClick={() => navigate(`/match/${data.link}`)}
      className={cn(
        'group w-full gap-6 hover:border-purple-500/50 duration-300 cursor-pointer hover:scale-103 transition-transform',
        className
      )}
    >
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            {data.championship}
            <p className='text-xs text-muted-foreground'>
              {formattedMatchDate}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(data.status)} flex items-center`}
          >
            {data.status === 'playing' && (
              <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
            )}
            {data.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-around'>
          <div className='flex flex-col items-center gap-2'>
            <div
              className={cn(
                'relative flex items-center justify-center',
                'h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary',
                'sm:h-14 sm:w-14 md:h-16 md:w-16'
              )}
            >
              {imageLoading && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Loading size='sm' />
                </div>
              )}
              <img
                src={`https://gamehub-mcq4.onrender.com/team/${data.team1Id}/logo`}
                alt={`Logo do time ${data.team1Name}`}
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  imageLoading ? 'opacity-0' : 'opacity-100'
                )}
                onLoad={() => setImageLoading(false)}
                onError={e => {
                  e.currentTarget.src = withoutLogo;
                  setImageLoading(false);
                }}
              />
            </div>
            <p>{data.team1Name}</p>
          </div>
          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-2 text-3xl font-black italic text-primary tracking-tighter'>
              <span>
                {data.scoreTeam1 ?? 0} - {data.scoreTeam2 ?? 0}
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <div
              className={cn(
                'relative flex items-center justify-center',
                'h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary',
                'sm:h-14 sm:w-14 md:h-16 md:w-16'
              )}
            >
              {imageLoading && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Loading size='sm' />
                </div>
              )}
              <img
                src={`https://gamehub-mcq4.onrender.com/team/${data.team2Id}/logo`}
                alt={`Logo do time ${data.team2Name}`}
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  imageLoading ? 'opacity-0' : 'opacity-100'
                )}
                onLoad={() => setImageLoading(false)}
                onError={e => {
                  e.currentTarget.src = withoutLogo;
                  setImageLoading(false);
                }}
              />
            </div>
            <p>{data.team2Name}</p>
          </div>
        </div>
      </CardContent>
      <div className='px-4 -mb-2'>
        <hr className='border-border' />
      </div>
      <CardFooter className='flex justify-between'>
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs',
            data.winner != 'Indefinido' && 'text-gold',
            'font-medium'
          )}
        >
          {data.winner != 'Indefinido' && <Trophy size={14} />}
          <span>
            {data.winner != 'Indefinido'
              ? `Vencedor: ${data.winner}`
              : 'Time vencedor ainda não definido!'}
          </span>
        </div>
        <p className='flex items-center gap-1 text-purple-500 text-sm font-semibold group-hover:text-purple-400 transition-colors'>
          Detalhes <ChevronRight size={16} />
        </p>
      </CardFooter>
    </Card>
  );
}
