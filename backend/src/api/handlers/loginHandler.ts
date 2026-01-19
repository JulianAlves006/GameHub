import { createLog } from '../repositories/logRepository.ts';
import { getUserByEmail } from '../repositories/userRepository.ts';
import { loginService } from '../services/loginService.ts';
import { loginValidation } from '../validations/validations.ts';

export async function loginHandler(body: any) {
  try {
    const { email, password } = body;
    loginValidation(body);

    const user = await getUserByEmail(email);

    const response = await loginService(user, password);

    await createLog(
      response.user.id,
      'Login',
      'Usuário realizou login no sistema'
    );

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no loginHandler: ', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido no login';
    throw new Error(errorMessage);
  }
}
