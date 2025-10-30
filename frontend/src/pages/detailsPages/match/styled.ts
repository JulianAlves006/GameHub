import styled, { keyframes } from 'styled-components';
import * as colors from '../../../config/colors';

const shimmer = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

export const Card = styled.section`
  width: min(720px, 92vw);
  margin: 24px auto;
  background: linear-gradient(180deg, #1b1b22, #17171d);
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  color: ${colors.primaryText};
`;

export const Meta = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;

export const Pill = styled.ul`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(90deg, #6c63ff, #00c2ff);
  background-size: 200% 200%;
  animation: ${shimmer} 6s linear infinite;
`;

export const PillSelect = styled.select`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(90deg, #6c63ff, #00c2ff);
  background-size: 200% 200%;
  animation: ${shimmer} 6s linear infinite;
`;

export const Champ = styled.span`
  color: #a6a6b3;
  font-size: 13px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
`;

export const Team = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  &.right {
    justify-content: end;
  }
`;

export const Logo = styled.img`
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #2b2b34;
  cursor: pointer;
`;

export const Name = styled.span`
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Score = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  padding: 4px 14px;
  border-radius: 12px;
  background: #121218;
  border: 1px solid #2a2a33;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);

  h1 {
    font-size: 2em;
    line-height: 1;
    margin: 0;
    font-weight: 700;
  }

  input {
    font-size: 2em;
    font-weight: bold;
    margin: 0;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
  }
`;

export const PrizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
`;

// Card individual do prêmio
export const PrizeCard = styled.div`
  margin-top: 10px;
  background: linear-gradient(180deg, ${colors.cardsColor}, #14141a);
  border: 1px solid #2a2a33;
  border-radius: 14px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
    border-color: ${colors.secondaryColor};
  }
`;

// Badge do prêmio (emoji/ícone)
export const PrizeBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  user-select: none;
  background: linear-gradient(
    90deg,
    ${colors.primaryColor},
    ${colors.secondaryColor}
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`;

// Título do item de prêmio (ex.: “Vale-compras”)
export const PrizeTitle = styled.h3`
  margin: 10px 0 6px 0;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.primaryText};
`;

// Descrição complementar (opcional)
export const PrizeDesc = styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: #a6a6b3;
  line-height: 1.35;
`;

// ====== MÉTRICAS ======
export const MetricsWrap = styled.section`
  width: min(720px, 92vw);
  margin: 18px auto 28px auto;
  background: linear-gradient(180deg, #1b1b22, #17171d);
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 16px 18px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1.6fr 140px;
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const baseField = `
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #2a2a33;
  background: #121218;
  color: ${colors.primaryText};
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: ${colors.secondaryColor};
    box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
  }

  &::placeholder {
    color: #8e8e98;
  }
`;

export const Input = styled.input`
  ${baseField}
  text-align: center;
`;

export const Select = styled.select`
  ${baseField}
`;

export const TextArea = styled.textarea`
  ${baseField}
  resize: vertical;
`;

export const Button = styled.button`
  ${baseField}
  cursor: pointer;
  font-weight: 700;
  text-align: center;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    opacity 0.12s ease;
  background: linear-gradient(
    90deg,
    ${colors.primaryColor},
    ${colors.secondaryColor}
  );
  border-color: transparent;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    opacity: 0.9;
  }
`;

export const MetricsList = styled.ul`
  margin-top: 14px;
  display: grid;
  gap: 8px;
`;

export const MetricItem = styled.li`
  display: grid;
  grid-template-columns: 140px 1.2fr 60px 1fr; /* tipo | jogador | qty | desc */
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #121218;
  border: 1px solid #2a2a33;
  border-radius: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

export const MetricPlayer = styled.span`
  color: #ddd;
  opacity: 0.95;
`;

export const MetricType = styled.span`
  font-weight: 700;
  text-transform: capitalize;
`;

export const MetricQty = styled.span`
  opacity: 0.85;
`;

export const MetricDesc = styled.span`
  color: #a6a6b3;
`;

export const EmptyState = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px dashed #2a2a33;
  border-radius: 10px;
  color: #a6a6b3;
  text-align: center;
`;
