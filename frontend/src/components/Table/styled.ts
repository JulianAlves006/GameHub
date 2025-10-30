import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Data = styled.table`
  border-collapse: collapse;
  width: 100%;
  text-align: center;

  th,
  td {
    padding: 15px;
    border-bottom: 1px solid grey;
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const TableCard = styled.section`
  width: min(90%, 92vw);
  background: ${colors.cardsColor};
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  color: ${colors.primaryText};
  margin: 10px 0 10px 0;
`;
