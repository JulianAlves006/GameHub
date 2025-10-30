import type { Response } from 'express';
import * as awardChampionshipService from '../services/awardChampionshipService.ts';

export class awardChampionshipController {
  getAwardChampionship = async (req: any, res: Response) => {
    try {
      const response = await awardChampionshipService.getAwardChampionship(
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
      const response = await awardChampionshipService.deleteAwardChampionship(
        req.query.id,
        req.user
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

export default new awardChampionshipController();
