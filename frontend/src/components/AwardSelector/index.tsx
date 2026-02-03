import React from 'react';
import { FaTrashAlt, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Award } from '../../types/types';

interface SelectedAward {
  id: number;
  description: string;
  uniqueIndex?: number;
  awardsChampionships?: boolean;
}

interface AwardSelectorProps {
  awards: Award[];
  selectedAwards: SelectedAward[];
  onAwardSelect: (award: SelectedAward) => void;
  onAwardRemove: (index: number, award: SelectedAward) => void;
  onNewAwardRemove: (uniqueIndex: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

const AwardSelector: React.FC<AwardSelectorProps> = ({
  awards,
  selectedAwards,
  onAwardSelect,
  onAwardRemove,
  onNewAwardRemove,
  placeholder = 'Selecionar prêmios',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (id === 0) return;

    // Verificar se o prêmio já foi selecionado
    const isAlreadySelected = selectedAwards.some(award => award.id === id);
    if (isAlreadySelected) {
      toast.error('Este prêmio já foi selecionado');
      e.target.value = '0';
      return;
    }

    const selectedAward = awards.find(award => award.id === id);
    if (selectedAward) {
      const uniqueIndex = Date.now() + Math.random();
      onAwardSelect({
        id: selectedAward.id,
        description: selectedAward.description,
        uniqueIndex,
        awardsChampionships: false,
      });
    }

    // Reset select
    e.target.value = '0';
  };

  return (
    <div className='flex flex-col w-[60%] gap-3 self-center'>
      <select
        name='award'
        id='award'
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'text-foreground bg-transparent p-2.5 rounded-lg',
          'border border-border w-full my-2.5 text-center',
          'text-sm cursor-pointer transition-all',
          'hover:brightness-125',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          '[&_option]:bg-card [&_option]:text-foreground [&_option]:p-2'
        )}
      >
        <option value={0}>{placeholder}</option>
        {awards.map(award => (
          <option key={award.id} value={award.id}>
            {award.description}
          </option>
        ))}
      </select>

      {selectedAwards.length > 0 ? (
        <div
          className={cn(
            'flex flex-col gap-1.5 max-h-[120px] overflow-y-auto p-1 my-2',
            'scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-primary'
          )}
        >
          {selectedAwards.map((award, index) => (
            <div
              key={award.uniqueIndex || award.id}
              className={cn(
                'flex items-center justify-between px-3 py-2',
                'bg-gradient-to-br from-card to-muted/30',
                'border border-border/50 rounded-md',
                'transition-all relative',
                'hover:-translate-y-0.5 hover:shadow-md hover:border-secondary'
              )}
            >
              <span className='text-foreground font-medium text-sm flex-1 text-left'>
                {award.description}
              </span>
              <button
                type='button'
                onClick={() => {
                  if (award.awardsChampionships) {
                    onAwardRemove(index, award);
                  } else {
                    onNewAwardRemove(award.uniqueIndex!);
                  }
                }}
                title={
                  award.awardsChampionships
                    ? 'Remover prêmio existente'
                    : 'Remover prêmio selecionado'
                }
                className={cn(
                  'flex items-center justify-center',
                  'w-6 h-6 rounded-full',
                  'bg-destructive text-white border-none',
                  'cursor-pointer transition-all flex-shrink-0',
                  'hover:bg-red-700 hover:scale-110',
                  'active:scale-95'
                )}
              >
                {award.awardsChampionships ? (
                  <FaTrashAlt size={12} />
                ) : (
                  <FaTimesCircle size={12} />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center p-4',
            'text-foreground/60 italic text-sm',
            'bg-white/5 border border-dashed border-border/50 rounded-md'
          )}
        >
          Nenhum prêmio selecionado
        </div>
      )}
    </div>
  );
};

export default AwardSelector;
