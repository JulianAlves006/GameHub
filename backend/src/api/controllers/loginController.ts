import type { Response } from 'express';
import { loginHandler } from '../handlers/loginHandler.ts';

class LoginController {
  login = async (req: any, res: Response) => {
    try {
      const response = await loginHandler(req.body);

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new LoginController();
