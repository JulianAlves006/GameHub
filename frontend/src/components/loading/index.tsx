import React from 'react';
import { cn } from '@/lib/utils';

export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingProps {
  /** Mostra um overlay ocupando a tela inteira */
  fullscreen?: boolean;
  /** Mensagem abaixo do spinner */
  message?: string;
  /** Tamanho do spinner */
  size?: LoadingSize;
  /** Opacidade do fundo no overlay (0 a 1) */
  overlayOpacity?: number;
  /** Se true, ocupa a altura do container pai e centraliza (útil em páginas) */
  fillParent?: boolean;
  /** Classe opcional */
  className?: string;
  /** Test id */
  'data-testid'?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
} as const;

const Loading: React.FC<LoadingProps> = ({
  fullscreen = false,
  message,
  size = 'md',
  overlayOpacity = 0.45,
  fillParent = false,
  className,
  ...rest
}) => {
  const content = (
    <div
      role='status'
      aria-live='polite'
      aria-busy='true'
      className={cn(
        'relative z-10 grid place-items-center gap-3 p-6 rounded-2xl',
        'bg-card border border-border shadow-lg',
        'animate-pulse-glow',
        fillParent && 'min-h-[42vh] w-full max-w-3xl',
        className
      )}
      {...rest}
    >
      {/* Spinner */}
      <div
        aria-hidden
        className={cn(
          sizeClasses[size],
          'rounded-full border-[3px] border-muted border-t-transparent',
          'relative animate-spin'
        )}
      >
        {/* Gradient ring */}
        <div
          className={cn(
            'absolute inset-[-3px] rounded-full',
            'bg-gradient-conic from-primary via-secondary to-primary',
            'animate-spin'
          )}
          style={{
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
          }}
        />
      </div>
      {message && (
        <p className='text-sm text-foreground/90 font-medium'>{message}</p>
      )}
      <span className='sr-only'>Carregando</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className='fixed inset-0 z-[9999] grid place-items-center'>
        {/* Overlay */}
        <div
          className='absolute inset-0 bg-background/80 backdrop-blur-sm'
          style={{ opacity: overlayOpacity }}
        />
        {content}
      </div>
    );
  }

  // Modo inline (para dentro de cards, seções, etc.)
  return <div className='grid place-items-center'>{content}</div>;
};

export default React.memo(Loading);
