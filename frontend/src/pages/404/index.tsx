import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '../../components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'relative min-h-screen w-full flex items-center justify-center',
        'bg-gradient-to-b from-background to-background/80',
        'overflow-hidden'
      )}
    >
      {/* Sparkles Background */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 pointer-events-none',
          'bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.15)_0%,transparent_70%)]'
        )}
      />

      <div
        role='main'
        aria-labelledby='nf-title'
        className={cn(
          'relative z-10 flex flex-col items-center text-center',
          'max-w-lg px-6 py-12'
        )}
      >
        <h1
          id='nf-title'
          aria-label='Erro 404'
          className={cn(
            'text-[10rem] font-black leading-none',
            'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
            'drop-shadow-lg animate-pulse'
          )}
        >
          404
        </h1>
        <h2 className='text-2xl font-bold text-foreground mt-4'>
          Ops, página não encontrada
        </h2>
        <p className='text-muted-foreground mt-4 text-base leading-relaxed'>
          A URL que você tentou acessar não existe ou foi movida. Verifique o
          endereço ou volte para a página inicial.
        </p>

        <hr
          role='presentation'
          className={cn(
            'w-full my-8 border-none h-px',
            'bg-linear-to-r from-transparent via-border to-transparent'
          )}
        />

        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <Button onClick={() => navigate('/home')} size='lg'>
            Voltar para o início
          </Button>

          <a
            href='mailto:suporte@seudominio.com'
            aria-label='Falar com o suporte por email'
            className={cn(
              'px-6 py-3 rounded-lg border border-border',
              'text-foreground font-medium transition-all',
              'hover:bg-primary/10 hover:border-primary'
            )}
          >
            Falar com o suporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
