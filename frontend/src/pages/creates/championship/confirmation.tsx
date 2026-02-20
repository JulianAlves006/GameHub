import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationProps {
  handleSubmit: () => void;
}

export default function Confirmation({ handleSubmit }: ConfirmationProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirma a criação do campeonato?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação irá criar um campeonato e ele irá automaticamente aparecer
          nas listagens de campeonatos. Tem certeza de que deseja continuar?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleSubmit}>Criar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
