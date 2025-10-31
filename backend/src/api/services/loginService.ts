import { AppDataSource } from '../../data-source.ts';
import { User } from '../entities/User.ts';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createLog } from '../../utils.ts';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function login(data: any) {
  const { email, password } = data;
  try {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'profile'],
    });

    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }

    if (!user.password) {
      throw new Error('Usuário ou senha inválidos');
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
    createLog(user.id, 'Login', 'Usuário realizou login no sistema');
    return {
      message: 'Login realizado com sucesso!',
      token: token,
      user: user,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function checkPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return await argon2.verify(passwordHash, plainPassword);
}
