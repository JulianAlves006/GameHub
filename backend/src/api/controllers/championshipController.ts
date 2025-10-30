import type { Response } from 'express';
import * as championshipService from '../services/championshipService.ts';

class ChampionshipController {
  getChampionship = async (req: any, res: Response) => {
    try {
      const response = await championshipService.getChampionship(
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
      const response = await championshipService.createChampionchip(
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

      const response = await championshipService.editChampionship(
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
      const response = await championshipService.deleteChampionship(
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
