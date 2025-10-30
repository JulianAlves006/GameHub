import styled from 'styled-components';
import * as colors from '../../config/colors';

export const ConfirmButton = styled.button`
  color: ${colors.primaryText};
  background: ${colors.cardsColor};
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid ${colors.confirmButton};
  min-width: 10%;
  margin-bottom: 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.confirmButton};
  }
`;

export const CancelButton = styled.button`
  color: ${colors.primaryText};
  background: ${colors.cardsColor};
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid ${colors.cancelButton};
  min-width: 10%;
  margin-bottom: 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.cancelButton};
  }
`;
