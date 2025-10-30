import styled from 'styled-components';
import * as colors from '../../config/colors';
import { Card } from '../../style';

export const UserContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  list-style: none;
  gap: 24px;

  h1 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 32px;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid ${colors.secondaryColor};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  input {
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    color: inherit;
    border: none;
    border-bottom: 2px solid grey;
    background: transparent;
    outline: none;
    width: auto;
    min-width: 50px;
  }
`;

export const InfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  li {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: space-between;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid ${colors.secondaryColor};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    margin-top: 0;
    margin-left: auto;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: ${colors.secondaryColor};
  min-width: 80px;
`;

export const InfoValue = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;
