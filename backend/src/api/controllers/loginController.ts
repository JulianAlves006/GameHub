import type { Response } from 'express';
import { login } from '../services/loginService.ts';

class LoginController {
  login = async (req: any, res: Response) => {
    try {
      const response = await login(req.body);

      // Verifica se é um erro
      if (response && 'error' in response) {
        return res.status(400).json({ error: response.error });
      }

      // Verifica se é sucesso
      if (response && 'token' in response) {
        return res.status(200).json(response);
      }

      return res.status(500).json({ error: 'Erro interno do servidor' });
    } catch (error: any) {
      return res
        .status(500)
        .json({ erro: 'Erro interno do servidor', error: error.message });
    }
  };
}

export default new LoginController();
