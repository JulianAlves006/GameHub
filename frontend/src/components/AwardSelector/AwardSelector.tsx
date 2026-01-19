import React from 'react';
import { FaTrashAlt, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  AwardSelectorContainer,
  AwardSelect,
  SelectedAwardsList,
  AwardItem,
  AwardDescription,
  RemoveButton,
  EmptyState,
} from './styled';
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
    <AwardSelectorContainer>
      <AwardSelect
        name='award'
        id='award'
        onChange={handleChange}
        disabled={disabled}
      >
        <option value={0}>{placeholder}</option>
        {awards.map(award => (
          <option key={award.id} value={award.id}>
            {award.description}
          </option>
        ))}
      </AwardSelect>

      {selectedAwards.length > 0 ? (
        <SelectedAwardsList>
          {selectedAwards.map((award, index) => (
            <AwardItem key={award.uniqueIndex || award.id}>
              <AwardDescription>{award.description}</AwardDescription>
              <RemoveButton
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
              >
                {award.awardsChampionships ? (
                  <FaTrashAlt size={14} />
                ) : (
                  <FaTimesCircle size={14} />
                )}
              </RemoveButton>
            </AwardItem>
          ))}
        </SelectedAwardsList>
      ) : (
        <EmptyState>Nenhum prêmio selecionado</EmptyState>
      )}
    </AwardSelectorContainer>
  );
};

export default AwardSelector;
