import type { Response } from 'express';
import * as gamerHandler from '../handlers/gamerHandler.ts';

class GamerController {
  getTopGamers = async (req: any, res: Response) => {
    try {
      const response = await gamerHandler.getTopGamersHandler();
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getGamers = async (req: any, res: Response) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const idGamer = req.query.id ? parseInt(req.query.id) : null;

      // Validar parâmetros
      if (page < 1) {
        return res.status(400).json({ error: 'Página deve ser maior que 0' });
      }
      if (limit < 1 || limit > 100) {
        return res
          .status(400)
          .json({ error: 'Limite deve estar entre 1 e 100' });
      }

      const response = await gamerHandler.getGamersHandler(
        page,
        limit,
        idGamer as number | null
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerHandler.createGamerHandler(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerHandler.updateGamerHandler(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerHandler.deleteGamerHandler(req.query);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new GamerController();
