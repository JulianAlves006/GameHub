import { useEffect, useState } from 'react';
import { Container, Form, Title } from '../../../style';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/axios';
import Loading from '../../../components/loading';
import FileInput from '../../../components/FileInput';
import { getUser } from '../../../services/utils';

export default function TeamRegister() {
  const navigate = useNavigate();
  const user = getUser();
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.profile === 'admin') {
      toast.error('Você não possui permissão para acessar essa pagina');
      navigate('/home');
    } else if (user.gamers[0].score < 50000) {
      toast.error(
        'Somente gamers com mais de 50.000 pontos de score podem criar times.'
      );
      navigate('/home');
    }
    verifyUserTeam();
  }, []);

  async function verifyUserTeam() {
    setLoading(true);
    try {
      const { data } = await api.get(`/team?idAdmin=${user.gamers[0].id}`);
      if (data.teams.length > 0) {
        toast.error('Seu usuário já possui um time cadastrado.');
        navigate('/home');
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!name || !logo) {
      toast.error('Todas as informações precisam estar preenchidas!');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('logo', logo);
      fd.append('name', name);

      const { data } = await api.post('/team', fd);
      toast.success('Time criado com sucesso! Boa sorte nessa nova jornada!');
      navigate(`/team/${data?.id}`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <Title>Criar time</Title>
      <Form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Nome do time'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <FileInput
          id='logo'
          name='logo'
          accept='image/*'
          value={logo}
          onChange={setLogo}
          label='Logo do Time'
          placeholder='Selecionar logo do time'
          maxSize={5}
        />

        <button>Criar time</button>
      </Form>
    </Container>
  );
}
