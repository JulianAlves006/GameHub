import { toast } from 'sonner';

/**
 * Toast de confirmação com botões de ação
 * Usa a API do Sonner para exibir toasts interativos
 */
export const toastConfirm = (
  message: string,
  type: string,
  details?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  const isInvites =
    type === 'team_accept' || type === 'team_leave' || type === 'team_invite';

  if (isInvites) {
    // Toast com ações de confirmação/cancelamento
    toast(message, {
      description: details,
      duration: Infinity,
      action: {
        label: 'Confirmar',
        onClick: () => onConfirm?.(),
      },
      cancel: {
        label: 'Recusar',
        onClick: () => onCancel?.(),
      },
    });
  } else {
    // Toast informativo simples
    toast.info(message, {
      description: details,
      duration: 5000,
    });
  }
};
