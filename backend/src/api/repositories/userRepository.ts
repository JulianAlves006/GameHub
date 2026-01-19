import { AppDataSource } from '../../data-source.ts';
import { User } from '../entities/User.ts';

const userRepository = AppDataSource.getRepository(User);

export async function getUserByEmail(email: any) {
  const user = await userRepository.findOne({
    where: { email },
    select: ['id', 'name', 'email', 'password', 'profile', 'isActive'],
    relations: {
      gamers: { team: true, metrics: true },
    },
  });
  return user;
}

export async function createUser(user: any): Promise<User> {
  const exist = await userRepository.findBy({ email: user.email });
  if (exist.length > 0) throw new Error('Email já cadastrado');

  const newUser = userRepository.create(user);
  const savedUser = await userRepository.save(newUser);

  return (Array.isArray(savedUser) ? savedUser[0] : savedUser) as User;
}

export async function updateUser(newUser: any) {
  const user = await userRepository.findOne({
    where: { id: newUser.id },
  });

  if (!user) throw new Error('Usuário não encontrado');
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set(newUser)
    .where('id = :id', { id: newUser.id })
    .execute();

  return 'Usuário editado com sucesso!';
}

export async function deleteUser(id: number) {
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

export async function getUsers() {
  const users = await userRepository.find();
  return users;
}

export async function getUserByID(id: User['id']) {
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
