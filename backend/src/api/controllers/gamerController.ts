import type { Response } from 'express';
import * as gamerService from '../services/gamerService.ts';

class GamerController {
  getGamers = async (req: any, res: Response) => {
    try {
      const response = await gamerService.getGamers();
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerService.createGamer(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerService.updateGamer(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteGamer = async (req: any, res: Response) => {
    try {
      const response = await gamerService.deleteGamer(req.body.id);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new GamerController();
