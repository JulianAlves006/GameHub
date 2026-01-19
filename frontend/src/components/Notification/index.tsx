import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

import {
  NotificationContainer,
  NotificationContent,
  NotificationMessage,
  NotificationDetails,
  ButtonContainer,
  ConfirmButton,
  CancelButton,
  InfoContainer,
  InfoIcon,
  Divider,
} from './styled';

interface CustomToastProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeToast: () => void;
  type: string;
  details?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
const CustomToast = ({
  message,
  onConfirm,
  onCancel,
  closeToast,
  type,
  details,
}: CustomToastProps) =>
  type === 'team_accept' || type === 'team_leave' || type === 'team_invite' ? (
    <NotificationContainer>
      <NotificationContent>
        <NotificationMessage>{message}</NotificationMessage>
        <ButtonContainer>
          <ConfirmButton
            onClick={() => {
              onConfirm?.();
              closeToast();
            }}
          >
            <FaCheck size={14} />
            Confirmar
          </ConfirmButton>
          <CancelButton
            onClick={() => {
              onCancel?.();
              closeToast();
            }}
          >
            <FaTimes size={14} />
            Cancelar
          </CancelButton>
        </ButtonContainer>
      </NotificationContent>
    </NotificationContainer>
  ) : (
    <NotificationContainer>
      <NotificationContent>
        <InfoContainer>
          <InfoIcon>
            <FaInfoCircle size={16} />
          </InfoIcon>
          <NotificationMessage>{message}</NotificationMessage>
        </InfoContainer>
        {details && (
          <>
            <Divider />
            <NotificationDetails>{details}</NotificationDetails>
          </>
        )}
      </NotificationContent>
    </NotificationContainer>
  );

export const toastConfirm = (
  message: string,
  type: string,
  details?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  const isInvites =
    type === 'team_accept' || type === 'team_leave' || type === 'team_invite';

  toast(
    ({ closeToast }) => (
      <CustomToast
        message={message}
        type={type}
        details={details}
        onConfirm={onConfirm}
        onCancel={onCancel}
        closeToast={closeToast}
      />
    ),
    {
      position: 'top-right',
      autoClose: isInvites ? false : 5000,
      closeOnClick: false,
      draggable: false,
    }
  );
};
