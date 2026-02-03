import { Check } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DropDownContentProps {
  selectedFilter: 'score' | 'name';
  setSelectedFilter: (filter: 'score' | 'name') => void;
}

export default function DropDownContent({
  selectedFilter,
  setSelectedFilter,
}: DropDownContentProps) {
  return (
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel className='text-muted-foreground text-xs'>
          Ordenar por
        </DropdownMenuLabel>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'score' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('score')}
        >
          Maior pontuação
          {selectedFilter === 'score' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex items-center justify-between gap-2',
            selectedFilter === 'name' && 'bg-accent text-accent-foreground'
          )}
          onClick={() => setSelectedFilter('name')}
        >
          Nome (A - Z)
          {selectedFilter === 'name' && <Check className='h-4 w-4' />}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
