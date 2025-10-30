import styled from 'styled-components';
import * as colors from '../../config/colors';

export const AwardSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  gap: 12px;
  align-self: center;
`;

export const AwardSelect = styled.select`
  color: ${colors.primaryText};
  background: none;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid grey;
  width: 100% !important;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    filter: brightness(130%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  option {
    background: ${colors.cardsColor};
    color: ${colors.primaryText};
    padding: 8px;
  }
`;

export const SelectedAwardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
  padding: 4px;
  margin: 8px 0;

  /* Custom scrollbar - Webkit */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      135deg,
      ${colors.primaryColor},
      ${colors.secondaryColor}
    );
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      135deg,
      ${colors.secondaryColor},
      ${colors.primaryColor}
    );
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${colors.primaryColor} rgba(255, 255, 255, 0.1);
`;

export const AwardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: linear-gradient(135deg, ${colors.cardsColor}, #2a2a33);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border-color: ${colors.secondaryColor};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${colors.primaryColor},
      ${colors.secondaryColor}
    );
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

export const AwardDescription = styled.span`
  color: ${colors.primaryText};
  font-weight: 500;
  font-size: 13px;
  flex: 1;
  text-align: left;
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${colors.cancelButton};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #d32f2f;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: ${colors.primaryText};
  opacity: 0.6;
  font-style: italic;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 6px;
`;
