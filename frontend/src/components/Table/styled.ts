import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Data = styled.table`
  border-collapse: collapse;
  width: 100%;
  text-align: left;

  th,
  td {
    padding: 14px 16px;
    border-bottom: 1px solid #2a2a33;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #121218;
    color: ${colors.secondaryColor};
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  tbody tr {
    transition:
      background 0.15s ease,
      transform 0.15s ease;
  }

  tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }

  tbody tr:hover {
    background: rgba(108, 99, 255, 0.08);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  a {
    color: ${colors.primaryText};
    text-decoration: none;
    position: relative;
    font-weight: 600;
  }

  a::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }

  a:hover::after,
  a:focus-visible::after {
    transform: scaleX(1);
  }
`;

export const TableCard = styled.section`
  width: min(90%, 92vw);
  background: ${colors.cardsColor};
  border: 1px solid #2a2a33;
  border-radius: 16px;
  padding: 0; /* cabeçalho sticky fica colado nas bordas */
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  color: ${colors.primaryText};
  margin: 10px auto;
  overflow: hidden; /* arredondamento do card + tabela */

  /* wrapper de rolagem horizontal para telas pequenas */
  & > div {
    width: 100%;
    overflow-x: auto;
  }
`;
