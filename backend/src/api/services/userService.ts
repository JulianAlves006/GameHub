import argon2 from 'argon2';

import { AppDataSource } from '../../data-source.ts';
import { User } from '../entities/User.ts';
const userRepository = AppDataSource.getRepository(User);

export async function getUser(id: number) {
  if (id) {
    const users = await userRepository.find({
      relations: {
        gamers: { team: true, metrics: true },
      },
      where: {
        id: id,
      },
    });
    return users;
  }
  const users = await userRepository.find();
  return users;
}

export async function createUser(body: User) {
  const { name, email, password, profile } = body;

  // Validação dos campos obrigatórios
  if (!name || !email || !password || !profile) {
    throw new Error(
      'Todos os campos são obrigatórios: name, email, password, profile'
    );
  }
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  const user = {
    name,
    email,
    password: passwordHash,
    profile,
    isActive: 1,
  };

  const exist = await userRepository.findBy({ email: email });
  if (exist.length > 0) throw new Error('Email já cadastrado');

  const newUser = userRepository.create(user);
  await userRepository.save(newUser);
  return newUser;
}

export async function updateUser(body: User) {
  const { id, name, email, password } = body;

  if (!name || !email) throw new Error('Nome e email são obrigatórios!');

  let newUser;
  if (password) {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    newUser = {
      name,
      email,
      password: passwordHash,
    };
  } else {
    newUser = {
      name,
      email,
    };
  }
  const userRepository = AppDataSource.getRepository('users');
  const user = await userRepository.findOne({
    where: { id },
  });

  if (!user) throw new Error('Usuário não encontrado');
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set(newUser)
    .where('id = :id', { id })
    .execute();

  return 'Usuário editado com sucesso!';
}

export async function deleteUser(
  id: User['id'],
  userData: { id: number; role: string }
) {
  if (!id) throw new Error('Id é obrigatório para essa requisição');
  if (userData.role !== 'admin')
    throw new Error(
      'Somente usuários administradores podem excluir outros usuários'
    );
  const userRepository = AppDataSource.getRepository('users');
  const user = await userRepository.findOne({
    where: { id },
  });

  if (!user) throw new Error('Usuário não encontrado');

  if (user?.profile === 'admin')
    throw new Error('Usuário administrador não pode ser excluído');

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ isActive: 0 })
    .where('id = :id', { id })
    .execute();
  return `Usuário deletado com sucesso`;
}
