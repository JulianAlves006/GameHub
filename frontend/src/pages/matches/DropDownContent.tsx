import { Check } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DropDownContentProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export default function DropDownContent({
  selectedFilter,
  setSelectedFilter,
}: DropDownContentProps) {
  return (
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel className='text-muted-foreground text-xs'>
          Filtrar por
        </DropdownMenuLabel>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'all' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('all')}
        >
          Todas
          {selectedFilter === 'all' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'pending' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('pending')}
        >
          Pendentes
          {selectedFilter === 'pending' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'playing' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('playing')}
        >
          Jogando
          {selectedFilter === 'playing' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'finished' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('finished')}
        >
          Finalizadas
          {selectedFilter === 'finished' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
