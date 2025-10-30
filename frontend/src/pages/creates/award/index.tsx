import { useState } from 'react';
import { Container, Form, Title } from '../../../style';
import api from '../../../services/axios';
import { toast } from 'react-toastify';

export default function Awards() {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [others, setOthers] = useState('');
  const [value, setValue] = useState(0);
  const [medal, setMedal] = useState(0);
  const [trophy, setTrophy] = useState(0);

  function handleTypeChange(selectedType: string) {
    // Resetar todos para 0
    setValue(0);
    setMedal(0);
    setTrophy(0);

    // Definir o tipo selecionado
    setType(selectedType);

    // Ativar o campo correspondente
    if (selectedType === 'value') {
      setValue(1);
    } else if (selectedType === 'medal') {
      setMedal(1);
    } else if (selectedType === 'trophy') {
      setTrophy(1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !type || !others) {
      toast.error('Todos os dados devem estar preenchidos!');
      return;
    }
    try {
      await api.post('/award', {
        description,
        value,
        medal,
        trophy,
        others,
      });
      toast.success('Premio criado com sucesso!');
      // Resetar o formulário
      setDescription('');
      setType('');
      setOthers('');
      setValue(0);
      setMedal(0);
      setTrophy(0);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Erro ao criar premio';
      toast.error(errorMessage);
    }
  }
  return (
    <Container>
      <Title>Criar premios</Title>
      <Form onSubmit={handleSubmit}>
        <h1>Premio</h1>
        <label htmlFor='Description'>
          Descrição
          <input
            type='text'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <select
          name='type'
          id='type'
          value={type}
          onChange={e => handleTypeChange(e.target.value)}
        >
          <option value=''>Tipo</option>
          <option value='value'>Valor</option>
          <option value='trophy'>Troféu</option>
          <option value='medal'>Medalha</option>
        </select>
        <label htmlFor='Description'>
          Outros (Observações ou detalhes)
          <input
            type='text'
            value={others}
            onChange={e => setOthers(e.target.value)}
          />
        </label>
        <button>Enviar</button>
      </Form>
    </Container>
  );
}
