import { toast } from 'react-toastify';

import { ConfirmButton, CancelButton } from './styled';

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
  type === 'team_accept' ? (
    <div>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <ConfirmButton
          onClick={() => {
            onConfirm?.();
            closeToast();
          }}
        >
          Confirmar
        </ConfirmButton>
        <CancelButton
          onClick={() => {
            onCancel?.();
            closeToast();
          }}
        >
          Cancelar
        </CancelButton>
      </div>
    </div>
  ) : (
    <div>
      <p>{message}</p>
      <hr />
      <p style={{ marginTop: '10px' }}>{details}</p>
    </div>
  );

export const toastConfirm = (
  message: string,
  type: string,
  details?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  const isTeamAccept = type === 'team_accept';

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
      autoClose: isTeamAccept ? false : 5000,
      closeOnClick: false,
      draggable: false,
    }
  );
};
