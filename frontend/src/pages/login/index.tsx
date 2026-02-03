import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';
import Loading from '../../components/loading';
import logo from '../../assets/logo.png';
import api from '../../services/axios';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const ctx = useApp();

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
      ctx.setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errors = error.response?.data?.error as
          | string[]
          | string
          | undefined;

        if (Array.isArray(errors) && errors.length > 0) {
          errors.forEach(e => toast.error(e));
          return;
        }

        toast.error(errors || 'Erro ao fazer login');
      } else {
        toast.error('Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading fullscreen message='Carregando dados...' />}
      <section className='flex flex-col items-center min-h-screen'>
        <img src={logo} alt='logo' className='w-[35%] max-w-[400px] my-12' />
        <form
          onSubmit={handleLogin}
          className={cn(
            'relative flex flex-col items-center w-full max-w-md mx-auto',
            'border border-border rounded-xl p-8 shadow-lg',
            'bg-card text-card-foreground gap-4'
          )}
        >
          <h1 className='text-3xl font-bold mb-4 text-foreground'>Login</h1>
          <Input
            type='email'
            value={email}
            placeholder='Email'
            onChange={e => setEmail(e.target.value)}
            className='w-full'
          />
          <Input
            type='password'
            value={password}
            placeholder='Senha'
            onChange={e => setPassword(e.target.value)}
            className='w-full'
          />
          <Button type='submit' className='w-full mt-2'>
            Logar
          </Button>
          <Link
            to='/register'
            className='text-sm text-muted-foreground hover:text-primary transition-colors mt-2'
          >
            Ainda não tem uma conta? Cadastre-se aqui!
          </Link>
        </form>
      </section>
    </>
  );
}
