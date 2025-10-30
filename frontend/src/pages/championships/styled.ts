import styled from 'styled-components';
import * as colors from '../../config/colors';

export const PageHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: min(90%, 92vw);
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
`;

export const FilterSelect = styled.select`
  color: ${colors.primaryText};
  background: rgba(108, 99, 255, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(108, 99, 255, 0.3);
  font-size: 14px;
  font-weight: 500;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(108, 99, 255, 0.15);
    border-color: ${colors.secondaryColor};
  }

  &:focus {
    outline: none;
    border-color: ${colors.secondaryColor};
    box-shadow: 0 0 0 2px rgba(0, 194, 255, 0.2);
  }

  option {
    background: #1a1a1a;
    color: ${colors.primaryText};
  }
`;

export const AddButton = styled.button`
  color: ${colors.primaryText};
  background: ${colors.primaryColor};
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid ${colors.primaryColor};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${colors.secondaryColor};
    border-color: ${colors.secondaryColor};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  margin: 5px 0;
`;
