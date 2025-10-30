import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import Loading from '../../components/loading';
import { Form } from '../../style';
import { FormContainer, Logo } from './styled';
import logo from '../../assets/logo.png';
import api from '../../services/axios';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }
    if (formErrors) return;
    setLoading(true);
    try {
      const { data } = await api.post('/login', {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login realizado com sucesso!');
      navigate('/home');
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
        <Form onSubmit={handleLogin}>
          <h1>Login</h1>
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
          <button type='submit'>Logar</button>
          <Link to='/register'>Ainda não tem uma conta? Cadastre-se aqui!</Link>
        </Form>
      </FormContainer>
    </>
  );
}
