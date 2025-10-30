import styled from 'styled-components';
import * as colors from '../../config/colors';

export const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60% !important;
  margin: 10px 0 10px 0 !important;
  align-self: center !important;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${colors.primaryText};
    margin-bottom: 8px;
  }

  .error {
    color: #f44336;
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const FileInputButton = styled.button<{
  $dragActive: boolean;
  $disabled: boolean;
  $hasFile: boolean;
  $error: boolean;
}>`
  color: ${colors.primaryText} !important;
  background: none !important;
  padding: 10px !important;
  border-radius: 10px !important;
  border: 1px solid grey !important;
  width: 100% !important;
  margin: 10px 0 10px 0 !important;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')} !important;
  transition: all 0.2s ease !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  min-height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  &:hover:not(:disabled) {
    filter: brightness(130%) !important;
  }

  &:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  div {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    flex-wrap: nowrap !important;
    justify-content: center !important;
    text-align: center !important;
  }

  svg {
    flex-shrink: 0 !important;
  }
`;

export const FileInputHidden = styled.input`
  display: none;
`;

export const FilePreview = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;

  img {
    max-width: 80px;
    max-height: 80px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid ${colors.secondaryColor};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const FileName = styled.span`
  font-weight: 600;
  color: ${colors.primaryColor};
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f44336;
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
