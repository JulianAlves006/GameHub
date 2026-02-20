import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import withoutLogo from '../../assets/withoutLogo.png';
import Loading from '../loading';
import { useApp } from '@/contexts/AppContext';
interface TeamCardProps {
  id: number;
  position: number;
  name: string;
  bestPlayer: string;
  score: number;
  isTopThree?: boolean;
}

function formatScore(score: number): string {
  return new Intl.NumberFormat('pt-BR').format(score);
}

function getMedalIcon(position: number) {
  switch (position) {
    case 1:
      return <Trophy className='h-6 w-6 text-gold' />;
    case 2:
      return <Medal className='h-6 w-6 text-silver' />;
    case 3:
      return <Award className='h-6 w-6 text-bronze' />;
    default:
      return null;
  }
}

function getPositionStyle(position: number) {
  switch (position) {
    case 1:
      return 'bg-gradient-to-r from-gold/20 to-gold/5 border-gold/40 hover:border-gold/60';
    case 2:
      return 'bg-gradient-to-r from-silver/20 to-silver/5 border-silver/40 hover:border-silver/60';
    case 3:
      return 'bg-gradient-to-r from-bronze/20 to-bronze/5 border-bronze/40 hover:border-bronze/60';
    default:
      return 'bg-card hover:bg-secondary/50 border-border';
  }
}

export function TeamCard({
  id,
  position,
  name,
  bestPlayer,
  score,
  isTopThree = false,
}: TeamCardProps) {
  const navigate = useNavigate();
  const ctx = useApp();
  const [imageLoading, setImageLoading] = useState(true);

  const handleClick = () => {
    navigate(`/team/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'w-full group relative flex items-center gap-3 rounded-xl border p-3 cursor-pointer',
        'transition-all duration-300 hover:scale-[1.01] hover:shadow-lg',
        'sm:gap-4 sm:p-4 md:gap-6 md:p-5',
        getPositionStyle(position)
      )}
    >
      {/* Position */}
      <div className='flex w-10 shrink-0 flex-col items-center justify-center sm:w-12 md:w-16'>
        {isTopThree ? (
          <div className='flex flex-col items-center gap-0.5'>
            {getMedalIcon(position)}
            <span
              className={cn(
                'text-lg font-bold sm:text-xl md:text-3xl',
                position === 1 && 'text-gold',
                position === 2 && 'text-silver',
                position === 3 && 'text-bronze'
              )}
            >
              {position}º
            </span>
          </div>
        ) : (
          <span className='text-lg font-semibold text-muted-foreground sm:text-xl md:text-3xl'>
            {position}º
          </span>
        )}
      </div>

      {/* Team Logo */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary',
          'sm:h-14 sm:w-14 md:h-16 md:w-16',
          isTopThree ? 'border-primary/30' : 'border-border'
        )}
      >
        {imageLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loading size='sm' />
          </div>
        )}
        <img
          src={`${ctx.apiURL}/team/${id}/logo`}
          alt={`Logo do time ${name}`}
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

      {/* Team Info */}
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <h3 className='truncate text-sm font-bold text-foreground sm:text-base md:text-xl'>
          {name}
        </h3>
        <div className='flex items-center gap-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm'>
          <Users className='h-3 w-3 shrink-0 sm:h-4 sm:w-4' />
          <span className='truncate'>MVP: {bestPlayer}</span>
        </div>
      </div>

      {/* Score */}
      <div className='flex shrink-0 flex-col items-end gap-0.5'>
        <div className='flex items-center gap-1 sm:gap-2'>
          <TrendingUp
            className={cn(
              'h-3 w-3 sm:h-4 sm:w-4',
              isTopThree ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <span
            className={cn(
              'text-sm font-bold sm:text-lg md:text-2xl',
              isTopThree ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {formatScore(score)}
          </span>
        </div>
        <span className='text-[10px] text-muted-foreground sm:text-xs'>
          pontos
        </span>
      </div>

      {/* Glow effect for top 3 */}
      {isTopThree && (
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30',
            position === 1 && 'bg-gold',
            position === 2 && 'bg-silver',
            position === 3 && 'bg-bronze'
          )}
        />
      )}
    </div>
  );
}
