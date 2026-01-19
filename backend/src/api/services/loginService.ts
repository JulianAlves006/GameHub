import jwt from 'jsonwebtoken';
import { checkPassword } from '../validations/validations.ts';
import type { User } from '../entities/User.ts';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export async function loginService(
  user: User | null,
  password: string
): Promise<LoginResponse> {
  if (!user) {
    throw new Error('Usuário ou senha inválidos');
  }

  if (!user.password) {
    throw new Error('Usuário ou senha inválidos');
  }

  if (!user.isActive) {
    throw new Error('Usuário inativo.');
  }

  const isValid = await checkPassword(password, user.password);
  if (!isValid) {
    throw new Error('Usuário ou senha inválidos');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.profile,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    algorithm: 'HS256',
    issuer: 'GameHub',
    audience: 'GameHub-Users',
  });

  return {
    message: 'Login realizado com sucesso!',
    token: token,
    user: user,
  };
}
