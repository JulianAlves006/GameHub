import { useNavigate } from 'react-router-dom';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
export default function DropDownMenu() {
  const navigate = useNavigate();
  const ctx = useApp();
  return (
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => navigate('/user')}>
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            ctx.logout();
          }}
          variant='destructive'
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
