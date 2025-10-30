import type { Response } from 'express';
import * as userController from '../services/userService.ts';

class UserController {
  getUser = async (req: any, res: Response) => {
    try {
      const user = await userController.getUser(req.query.id || null);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  createUser = async (req: any, res: Response) => {
    try {
      const user = await userController.createUser(req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  updateUser = async (req: any, res: Response) => {
    try {
      const updatedUser = await userController.updateUser(req.body);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  deleteUser = async (req: any, res: Response) => {
    try {
      const id = req.body.id;
      const response = await userController.deleteUser(id, req.user);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}

export default new UserController();
