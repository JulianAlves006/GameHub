import styled from 'styled-components';
import * as colors from '../../config/colors';

export const NotificationContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NotificationMessage = styled.p`
  color: ${colors.primaryText};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
`;

export const NotificationDetails = styled.p`
  color: ${colors.primaryText};
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

export const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  background: linear-gradient(135deg, ${colors.confirmButton}, #2e7d32);
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2e7d32, ${colors.confirmButton});
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  background: linear-gradient(135deg, ${colors.cancelButton}, #d32f2f);
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #d32f2f, ${colors.cancelButton});
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(
    135deg,
    ${colors.primaryColor},
    ${colors.secondaryColor}
  );
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  margin: 8px 0;
`;
