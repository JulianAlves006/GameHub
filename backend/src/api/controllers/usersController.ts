import type { Response } from 'express';
import * as userHandler from '../handlers/userHandler.ts';

class UserController {
  getUser = async (req: any, res: Response) => {
    try {
      const user = await userHandler.getUserHandler(req.query.id || undefined);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  createUser = async (req: any, res: Response) => {
    try {
      const user = await userHandler.createUserHandler(req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  updateUser = async (req: any, res: Response) => {
    try {
      const updatedUser = await userHandler.updateUserHandler(req.body);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  deleteUser = async (req: any, res: Response) => {
    try {
      const id = req.query.id;
      const response = await userHandler.deleteUserHandler(id, req.user);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}

export default new UserController();
