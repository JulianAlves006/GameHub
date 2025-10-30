import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../../config/colors';
import { Card } from '../../../style';

export const TeamsContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: min(90%, 1400px);
  gap: 32px;
  margin: 24px auto;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: min(92vw, 720px);
    margin: 24px auto;
  }
`;

export const MatchesSection = styled.section`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MatchesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  width: 100%;

  h1 {
    font-size: 32px;
    margin: 0;
    color: ${colors.primaryText};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const AddMatchButton = styled(Link)`
  padding: 10px 20px;
  background: rgba(108, 99, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(108, 99, 255, 0.3);
  text-decoration: none;
  color: ${colors.primaryText};
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: rgba(108, 99, 255, 0.2);
    border-color: ${colors.secondaryColor};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MatchCard = styled(Card)`
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #2a2a33;
  width: 100%;
  margin: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border-color: ${colors.secondaryColor};
  }
`;

export const MatchContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const MatchTeam = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  &.right {
    flex-direction: row-reverse;
    text-align: right;
  }
`;

export const MatchLogo = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid ${colors.secondaryColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

export const MatchTeamName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primaryText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MatchVS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  min-width: 80px;
  flex-shrink: 0;

  span {
    font-size: 14px;
    font-weight: 700;
    color: ${colors.secondaryColor};
    letter-spacing: 2px;
  }

  @media (max-width: 768px) {
    min-width: 50px;
    padding: 0 8px;

    span {
      font-size: 12px;
      letter-spacing: 1px;
    }
  }
`;

export const Teams = styled(Card)`
  width: 100%;
  min-width: 280px;
  max-width: 400px;
`;

export const TeamsHeader = styled.div`
  margin-bottom: 20px;

  h1 {
    font-size: 32px;
    margin: 0;
    color: ${colors.primaryText};
  }

  hr {
    margin-top: 12px;
    border: none;
    border-top: 2px solid ${colors.secondaryColor};
    opacity: 0.3;
  }
`;

export const TeamsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TeamItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(108, 99, 255, 0.05);
  border: 1px solid rgba(108, 99, 255, 0.2);
  border-radius: 10px;
  text-decoration: none;
  color: ${colors.primaryText};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(108, 99, 255, 0.15);
    border-color: ${colors.secondaryColor};
    transform: translateX(4px);
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: ${colors.primaryText};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${colors.secondaryText};

  p {
    font-size: 16px;
    margin: 0;
  }
`;

export const Awards = styled.section`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 50px 0 80px 0;
`;

export const Admin = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #1a1a1a;
  padding: 20px;
  z-index: 1000;
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
