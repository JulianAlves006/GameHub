import styled, { keyframes } from 'styled-components';
import * as colors from '../../config/colors';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(108,99,255,0.0), inset 0 0 0 rgba(0,0,0,0.0); }
  50% { box-shadow: 0 0 24px rgba(0,194,255,0.25), inset 0 0 0 rgba(0,0,0,0.0); }
  100% { box-shadow: 0 0 0 rgba(108,99,255,0.0), inset 0 0 0 rgba(0,0,0,0.0); }
`;

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999; /* acima do app */
  display: grid;
  place-items: center;
`;

export const Overlay = styled.div<{ $opacity: number }>`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      60% 60% at 50% 30%,
      rgba(108, 99, 255, 0.15),
      transparent 60%
    ),
    radial-gradient(
      50% 50% at 80% 80%,
      rgba(0, 194, 255, 0.15),
      transparent 65%
    ),
    #000;
  opacity: ${({ $opacity }) => $opacity};
  backdrop-filter: blur(1.5px);
`;

export const InlineWrap = styled.div`
  display: grid;
  place-items: center;
`;

export const Box = styled.div<{ $fillParent: boolean }>`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 22px;
  border-radius: 16px;
  background: ${colors.cardsColor};
  border: 1px solid #2a2a33;
  animation: ${glow} 6s ease-in-out infinite;

  ${({ $fillParent }) =>
    $fillParent &&
    `
    min-height: 42vh;
    width: min(720px, 92vw);
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const sizeMap = {
  sm: 34,
  md: 52,
  lg: 76,
} as const;

export const Spinner = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: ${({ $size }) => sizeMap[$size]}px;
  height: ${({ $size }) => sizeMap[$size]}px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: transparent;
  position: relative;

  /* anel externo com gradiente animado */
  &:before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      ${colors.primaryColor},
      ${colors.secondaryColor},
      ${colors.primaryColor}
    );
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 3px),
      #000 0
    );
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
    filter: saturate(120%);
  }

  animation: ${spin} 1s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.2s;
  }
`;

export const Message = styled.p`
  color: ${colors.primaryText};
  font-size: 14px;
  opacity: 0.9;
`;
