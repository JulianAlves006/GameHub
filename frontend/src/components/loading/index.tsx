import React from 'react';
import { Wrapper, Overlay, Box, Spinner, Message, InlineWrap } from './styled';

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
    <Box
      role='status'
      aria-live='polite'
      aria-busy='true'
      $fillParent={fillParent}
      className={className}
      {...rest}
    >
      <Spinner aria-hidden $size={size} />
      {message && <Message>{message}</Message>}
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      >
        Carregando
      </span>
    </Box>
  );

  if (fullscreen) {
    return (
      <Wrapper>
        <Overlay $opacity={overlayOpacity} />
        {content}
      </Wrapper>
    );
  }

  // Modo inline (para dentro de cards, seções, etc.)
  return <InlineWrap>{content}</InlineWrap>;
};

export default React.memo(Loading);
