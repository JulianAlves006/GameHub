import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';
import logo from '../../assets/logo.png';
import { toast } from 'sonner';
import api from '../../services/axios';
import Loading from '../../components/loading';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

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

      // Pequeno delay para garantir que o token seja processado
      setTimeout(() => {
        navigate('/gamer');
      }, 100);
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

        toast.error(errors || 'Erro ao cadastrar');
      } else {
        toast.error('Erro ao cadastrar');
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
          onSubmit={handleRegister}
          className={cn(
            'relative flex flex-col items-center w-full max-w-md mx-auto',
            'border border-border rounded-xl p-8 shadow-lg',
            'bg-card text-card-foreground gap-4'
          )}
        >
          <h1 className='text-3xl font-bold mb-4 text-foreground'>Cadastro</h1>
          <Input
            type='text'
            value={name}
            placeholder='Nome'
            onChange={e => setName(e.target.value)}
            className='w-full'
          />
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
          <Input
            type='password'
            value={password2}
            placeholder='Confirmar senha'
            onChange={e => setPassword2(e.target.value)}
            className='w-full'
          />
          <Button type='submit' className='w-full mt-2'>
            Cadastrar-se
          </Button>
          <Link
            to='/'
            className='text-sm text-muted-foreground hover:text-primary transition-colors mt-2'
          >
            Já tem uma conta? Faça seu login!
          </Link>
        </form>
      </section>
    </>
  );
}
