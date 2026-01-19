import type { Response } from 'express';
import * as awardChampionshipHandler from '../handlers/awardChampionshipHandler.ts';

export class awardChampionshipController {
  getAwardChampionship = async (req: any, res: Response) => {
    try {
      const response =
        await awardChampionshipHandler.getAwardChampionshipHandler(
          req.query.idAward || null,
          req.query.idChampionship || null
        );
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  deleteAwardChampionship = async (req: any, res: Response) => {
    try {
      const response =
        await awardChampionshipHandler.deleteAwardChampionshipHandler(
          req.query.id,
          req.user
        );
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}

export default new awardChampionshipController();
