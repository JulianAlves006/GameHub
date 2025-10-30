import styled, { keyframes } from 'styled-components';
import * as colors from '../../config/colors';

/** Animação do 404 com gradiente passando */
const hueShift = keyframes`
  0% { filter: hue-rotate(0deg) saturate(120%); }
  50% { filter: hue-rotate(30deg) saturate(130%); }
  100% { filter: hue-rotate(0deg) saturate(120%); }
`;

/** Flutuação sutil */
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

/** Brilho pulsante no contorno */
const pulse = keyframes`
  0% { box-shadow: 0 0 0px rgba(108, 99, 255, 0.0); }
  50% { box-shadow: 0 0 24px rgba(108, 99, 255, 0.25); }
  100% { box-shadow: 0 0 0px rgba(108, 99, 255, 0.0); }
`;

/** “Aurora” no fundo (manchas animadas) */
const drift = keyframes`
  0% { transform: translate(-10%, -10%) scale(1); opacity: 0.35; }
  50% { transform: translate(10%, 10%) scale(1.1); opacity: 0.55; }
  100% { transform: translate(-10%, -10%) scale(1); opacity: 0.35; }
`;

export const Wrapper = styled.section`
  position: relative;
  min-height: calc(100dvh - 0px);
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;

  /* Vignette suave nas bordas para dar profundidade */
  &:after {
    content: '';
    position: absolute;
    inset: -20%;
    pointer-events: none;
    background:
      radial-gradient(
        60% 60% at 50% 20%,
        rgba(108, 99, 255, 0.12) 0%,
        rgba(0, 0, 0, 0) 55%
      ),
      radial-gradient(
        50% 50% at 80% 80%,
        rgba(0, 194, 255, 0.1) 0%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        120% 120% at 50% 50%,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.85) 70%
      );
    z-index: 0;
  }
`;

export const Sparkles = styled.i`
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(
      1200px 800px at 10% 20%,
      rgba(108, 99, 255, 0.2),
      transparent 60%
    ),
    radial-gradient(
      900px 700px at 90% 80%,
      rgba(0, 194, 255, 0.18),
      transparent 65%
    ),
    radial-gradient(
      600px 600px at 70% 10%,
      rgba(4, 206, 247, 0.14),
      transparent 70%
    );
  filter: blur(30px);
  animation: ${drift} 18s ease-in-out infinite;
  z-index: 0;
`;

/** Cartão central, seguindo seu visual de cards */
export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: min(820px, 94vw);
  background: ${colors.cardsColor};
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 28px 28px 30px;
  text-align: center;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
  animation: ${pulse} 6s ease-in-out infinite;

  /* Borda animada fina, sutil */
  &:before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(
      270deg,
      ${colors.primaryColor},
      ${colors.secondaryColor},
      ${colors.primaryColor}
    );
    background-size: 300% 300%;
    filter: blur(6px) saturate(120%);
    z-index: -1;
    opacity: 0.25;
    animation: ${hueShift} 8s linear infinite;
  }
`;

export const Big404 = styled.h1`
  margin: 8px 0 4px 0;
  font-size: clamp(72px, 14vw, 160px);
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(
    90deg,
    ${colors.primaryColor},
    ${colors.secondaryColor},
    ${colors.primaryColor}
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow:
    0 6px 24px rgba(0, 0, 0, 0.5),
    0 0 24px rgba(0, 194, 255, 0.15);
  animation:
    ${hueShift} 8s linear infinite,
    ${float} 5s ease-in-out infinite;
`;

export const Subtitle = styled.h2`
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 600;
  color: ${colors.primaryText};
  margin: 8px 0 6px 0;
`;

export const Paragraph = styled.p`
  max-width: 60ch;
  margin: 0 auto;
  color: ${colors.secondaryText};
  font-size: clamp(14px, 1.4vw, 16px);
  line-height: 1.6;
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  margin: 22px 0;
  background: linear-gradient(90deg, transparent, #2a2a33, transparent);
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
`;

const baseInteractive = `
  color: ${colors.primaryText};
  border-radius: 12px;
  padding: 12px 18px;
  border: 1px solid #2a2a33;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.2s ease;
  will-change: transform, filter;

  &:active { transform: translateY(1px) scale(0.99); }
  &:focus-visible {
    outline: 2px solid ${colors.secondaryColor};
    outline-offset: 2px;
  }
`;

export const HomeButton = styled.button`
  ${baseInteractive}
  background: ${colors.primaryColor};
  border-color: #3a2a66;

  &:hover {
    filter: brightness(1.15);
  }
`;

export const OutlineLink = styled.a`
  ${baseInteractive}
  background: transparent;
  border-color: #3a3a44;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    filter: brightness(1.1);
  }
`;
