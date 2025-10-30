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

interface Award {
  id: number;
  description: string;
  uniqueIndex?: number;
  awardsChampionships?: number | boolean;
}

interface AwardSelectorProps {
  awards: Award[];
  selectedAwards: Award[];
  onAwardSelect: (award: Award) => void;
  onAwardRemove: (index: number, award: Award) => void;
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
        ...selectedAward,
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
                  <FaTrashAlt size={12} />
                ) : (
                  <FaTimesCircle size={12} />
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
