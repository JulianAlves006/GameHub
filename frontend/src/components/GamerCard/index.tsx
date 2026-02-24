import { cn } from '@/lib/utils';
import { ChevronRight, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../Image';

interface Metric {
  id: number;
  quantity: number;
  type: string;
  description: string | null;
  createdAt: string;
}

interface GamerCardProps {
  data: {
    id: number;
    userID: number | undefined;
    name: string;
    team: string;
    score: number;
  };
  position: number;
  metrics?: Metric[];
  bestGamerID: number | undefined;
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <span className='text-[10px] font-medium uppercase tracking-wider text-muted-foreground'>
        {label}
      </span>
      <span
        className={cn(
          'text-sm font-bold text-foreground',
          value >= 70 && 'text-green-400',
          value >= 50 && value < 70 && 'text-yellow-400',
          value < 50 && 'text-red-400'
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function GamerCard({
  data,
  position,
  metrics,
  bestGamerID,
}: GamerCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  // Calcula as estatísticas somando as métricas por tipo
  const stats = useMemo(() => {
    const result = {
      gol: 0,
      defesa: 0,
      falta: 0,
      'chute ao gol': 0,
      assistencia: 0,
      'cartao amarelo': 0,
      'cartao vermelho': 0,
    };

    if (!metrics || metrics.length === 0) return result;

    metrics.forEach(metric => {
      const type = metric.type?.toLowerCase();
      if (type && type in result) {
        result[type as keyof typeof result] += metric.quantity || 0;
      }
    });

    return result;
  }, [metrics]);

  function getAverageScoreGradient(score: number): string {
    if (score >= 60) return 'from-primary to-pink-500';
    if (score >= 50) return 'from-pink-500 to-red-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  }

  return (
    <div
      onClick={() => {
        if (data.userID) navigate(`/user/${data.userID}`);
      }}
      className={cn(
        'cursor-pointer w-full group relative flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 sm:gap-3 sm:px-3 sm:py-3 md:gap-4 md:px-4',
        position <= 3 && 'hover:scale-[1.01]'
      )}
    >
      <div className='flex w-8 shrink-0 items-center justify-center sm:w-10 md:w-12'>
        {position === 1 ? (
          <div className='flex items-center gap-0.5 sm:gap-1'>
            <span className='text-lg font-bold text-gold sm:text-xl md:text-2xl'>
              1
            </span>
          </div>
        ) : position === 2 ? (
          <span className='text-lg font-bold text-silver sm:text-xl md:text-2xl'>
            {position}
          </span>
        ) : position === 3 ? (
          <span className='text-lg font-bold text-bronze sm:text-xl md:text-2xl'>
            {position}
          </span>
        ) : (
          <span className='text-base font-semibold text-muted-foreground sm:text-lg md:text-xl'>
            {position}
          </span>
        )}
      </div>

      <div className='relative'>
        {imgError ? (
          <Avatar className='h-9 w-9 shrink-0 border-2 border-border sm:h-10 sm:w-10 md:h-12 md:w-12'>
            <AvatarImage src={'/img.png'} alt={data.name} />
            <AvatarFallback className='bg-secondary text-xs text-foreground sm:text-sm'>
              {data.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Image
            className='h-9 w-9 border-2 border-border md:h-12 md:w-12 rounded-full object-cover'
            url={`/user/${data.userID}/profilePicture`}
            name={data.name}
            onError={() => {
              setImgError(true);
            }}
          />
        )}

        {position === 1 && data.id === bestGamerID && (
          <Trophy size={14} className='absolute top-0 right-0 text-gold' />
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='truncate text-xs font-bold uppercase tracking-wide text-foreground sm:text-sm md:text-base'>
          {data.name}
        </span>
        <span className='truncate text-[10px] text-muted-foreground sm:text-xs'>
          {data.team}
        </span>
      </div>

      <div className='hidden flex-1 items-center justify-center gap-4 lg:flex lg:gap-6'>
        <StatBadge label='GOL' value={stats.gol} />
        <StatBadge label='DEF' value={stats.defesa} />
        <StatBadge label='FAL' value={stats.falta} />
        <StatBadge label='CHUTE' value={stats['chute ao gol']} />
        <StatBadge label='ASST' value={stats.assistencia} />
        <StatBadge label='CA' value={stats['cartao amarelo']} />
        <StatBadge label='CV' value={stats['cartao vermelho']} />
      </div>

      <div className='flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-lg sm:h-9 sm:w-9 md:h-15 md:w-15 md:text-lg',
            getAverageScoreGradient(data.score)
          )}
        >
          {data.score}
        </div>
      </div>

      <button
        type='button'
        className='cursor-pointer hidden h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex'
        aria-label={`Ver mais sobre ${data.name}`}
      >
        <ChevronRight className='h-5 w-5' />
      </button>
    </div>
  );
}
