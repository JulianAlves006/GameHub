import type { Response } from 'express';
import * as awardHandler from '../handlers/awardHandler.ts';

export class AwardController {
  getAwards = async (req: any, res: Response) => {
    try {
      const response = await awardHandler.getAwardsHandler(
        req.query.id || null
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createAward = async (req: any, res: Response) => {
    try {
      const response = await awardHandler.createAwardHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateAward = async (req: any, res: Response) => {
    try {
      const response = await awardHandler.updateAwardHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteAward = async (req: any, res: Response) => {
    try {
      const response = await awardHandler.deleteAwardHandler(
        req.body.id,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        res
          .status(400)
          .json(
            `Não é possível excluir o prêmio. Ele está vinculado a um campeonato.`
          );
      }
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new AwardController();
