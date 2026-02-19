import { AppDataSource } from '../../data-source.ts';
import { deleteObject, getPresignedUrl, uploadBuffer } from '../../s3.ts';
import { User } from '../entities/User.ts';
import { v4 as uuid } from 'uuid';

const userRepository = AppDataSource.getRepository(User);
const PREFIX = process.env.S3_PUBLIC_PREFIX_USER;

export async function getUserByEmail(email: string) {
  const user = await userRepository.findOne({
    where: { email },
    select: ['id', 'name', 'email', 'password', 'profile', 'isActive'],
    relations: {
      gamers: { team: true, metrics: true },
    },
  });
  return user;
}

export async function createUser(
  user: User,
  profilePicture: Buffer | null = null,
  contentType: string | null = null
): Promise<User> {
  const email: string = user.email;
  const exist = await userRepository.findBy({ email });
  if (exist.length > 0) throw new Error('Email já cadastrado');

  let profilePictureKey: string | null = null;

  // Upload para S3 se houver foto de perfil
  if (profilePicture && contentType) {
    const now = new Date();
    const ext = contentType.split('/')[1] || 'png';
    const key = `${PREFIX}${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uuid()}.${ext}`;

    await uploadBuffer({
      key,
      buffer: profilePicture,
      contentType,
    });

    profilePictureKey = key;
  }

  const newUser = userRepository.create({
    ...user,
    profilePicture: profilePictureKey,
  });
  const savedUser = await userRepository.save(newUser);

  return (Array.isArray(savedUser) ? savedUser[0] : savedUser) as User;
}

export async function updateUser(
  newUser: Partial<User> & { id: number },
  profilePicture: Buffer | null = null,
  contentType: string | null = null
) {
  const user = await userRepository.findOne({
    where: { id: newUser.id },
  });

  if (!user) throw new Error('Usuário não encontrado');

  let newProfilePictureKey = user.profilePicture;

  // Se houver nova foto de perfil, fazer upload e deletar a antiga
  if (profilePicture && contentType) {
    // Deletar foto antiga se existir
    if (user.profilePicture) {
      try {
        await deleteObject({ key: user.profilePicture });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao deletar foto de perfil antiga:', error);
      }
    }

    // Upload da nova foto para S3
    const now = new Date();
    const ext = contentType.split('/')[1] || 'png';
    const key = `${PREFIX}${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uuid()}.${ext}`;

    await uploadBuffer({
      key,
      buffer: profilePicture,
      contentType,
    });

    newProfilePictureKey = key;
  }

  const updateData = {
    ...newUser,
    profilePicture: newProfilePictureKey,
  };

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set(updateData)
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

export async function getUserProfilePicture(id: number) {
  const user = await userRepository.findOne({
    where: { id },
  });

  if (!user) throw new Error('Usuário não encontrado');

  if (!user.profilePicture || user.profilePicture.trim() === '') {
    throw new Error('Foto de perfil não encontrada');
  }

  // Retorna a presigned URL do S3 (válida por 1 hora)
  const profilePictureUrl = await getPresignedUrl(user.profilePicture, 3600);
  return {
    ...user,
    profilePictureUrl,
  };
}
