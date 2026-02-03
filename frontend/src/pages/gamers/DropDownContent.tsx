import { Check } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type FilterType =
  | 'score'
  | 'name'
  | 'gol'
  | 'defesa'
  | 'falta'
  | 'chute ao gol'
  | 'assistencia'
  | 'cartao amarelo'
  | 'cartao vermelho';

interface DropDownContentProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'score', label: 'Maior pontuação' },
  { value: 'name', label: 'Nome (A - Z)' },
];

const metricOptions: { value: FilterType; label: string }[] = [
  { value: 'gol', label: 'Gols' },
  { value: 'defesa', label: 'Defesas' },
  { value: 'falta', label: 'Faltas' },
  { value: 'chute ao gol', label: 'Chutes ao gol' },
  { value: 'assistencia', label: 'Assistências' },
  { value: 'cartao amarelo', label: 'Cartões amarelos' },
  { value: 'cartao vermelho', label: 'Cartões vermelhos' },
];

export default function DropDownContent({
  selectedFilter,
  setSelectedFilter,
}: DropDownContentProps) {
  return (
    <DropdownMenuContent className='w-48'>
      <DropdownMenuGroup>
        <DropdownMenuLabel className='text-muted-foreground text-xs'>
          Ordenar por
        </DropdownMenuLabel>
        {filterOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              'flex items-center justify-between gap-2',
              selectedFilter === option.value &&
                'bg-accent text-accent-foreground'
            )}
            onClick={() => setSelectedFilter(option.value)}
          >
            {option.label}
            {selectedFilter === option.value && <Check className='h-4 w-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuLabel className='text-muted-foreground text-xs'>
          Por métrica
        </DropdownMenuLabel>
        {metricOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              'flex items-center justify-between gap-2',
              selectedFilter === option.value &&
                'bg-accent text-accent-foreground'
            )}
            onClick={() => setSelectedFilter(option.value)}
          >
            {option.label}
            {selectedFilter === option.value && <Check className='h-4 w-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
