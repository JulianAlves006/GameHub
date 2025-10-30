import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import { Form } from '../../style';
import { FormContainer, Logo } from './styled';
import logo from '../../assets/logo.png';
import { toast } from 'react-toastify';
import api from '../../services/axios';
import Loading from '../../components/loading';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let formErrors = false;
    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }
    if (password !== password2) {
      formErrors = true;
      toast.error('As senhas estão divergentes');
    }
    if (formErrors) return;
    setLoading(true);
    try {
      const { data } = await api.post('/user', {
        name,
        email,
        password,
        profile: 'gamer',
      });
      toast.success('Usuário criado com sucesso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Pequeno delay para garantir que o token seja processado
      setTimeout(() => {
        navigate('/gamer');
      }, 100);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors = error?.response?.data?.error as
        | string[]
        | string
        | undefined;

      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach(e => toast.error(e));
        return;
      }

      toast.error(errors);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <FormContainer>
        <Logo src={logo} alt='logo' />
        <Form onSubmit={handleRegister}>
          <h1>Cadastro</h1>
          <input
            type='name'
            value={name}
            placeholder='Nome'
            onChange={e => setName(e.target.value)}
          />
          <input
            type='email'
            value={email}
            placeholder='Email'
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type='password'
            value={password}
            placeholder='password'
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type='password'
            value={password2}
            placeholder='Confirmar senha'
            onChange={e => setPassword2(e.target.value)}
          />
          <button type='submit'>Cadastrar-se</button>
          <Link to='/'>Já tem uma conta? Faça seu login!</Link>
        </Form>
      </FormContainer>
    </>
  );
}
