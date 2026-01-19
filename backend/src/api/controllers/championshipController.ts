import type { Response } from 'express';
import * as championshipHandler from '../handlers/championshipHandler.ts';

class ChampionshipController {
  getChampionship = async (req: any, res: Response) => {
    try {
      const response = await championshipHandler.getChampionshipHandler(
        req.query.idChampionship || undefined,
        req.query.idAdmin || undefined
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createChampionship = async (req: any, res: Response) => {
    try {
      const response = await championshipHandler.createChampionshipHandler(
        req.body,
        req.body.awards || [],
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateChampionship = async (req: any, res: Response) => {
    try {
      // Converter array de IDs para formato esperado pelo service
      const awards = (req.body.awards || []).map((awardId: number) => ({
        award: awardId,
      }));

      const response = await championshipHandler.editChampionshipHandler(
        req.body,
        awards,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteChampionship = async (req: any, res: Response) => {
    try {
      const response = await championshipHandler.deleteChampionshipHandler(
        req.body.id,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new ChampionshipController();
