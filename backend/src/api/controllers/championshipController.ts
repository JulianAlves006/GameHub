import type { Response } from 'express';
import * as championshipHandler from '../handlers/championshipHandler.ts';

class ChampionshipController {
  getChampionship = async (req: any, res: Response) => {
    try {
      const idChampionship = req.query.idChampionship
        ? parseInt(req.query.idChampionship)
        : undefined;
      const idAdmin = req.query.idAdmin
        ? parseInt(req.query.idAdmin)
        : undefined;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validar parâmetros
      if (page < 1) {
        return res.status(400).json({ error: 'Página deve ser maior que 0' });
      }
      if (limit < 1 || limit > 100) {
        return res
          .status(400)
          .json({ error: 'Limite deve estar entre 1 e 100' });
      }

      const response = await championshipHandler.getChampionshipHandler(
        idChampionship,
        idAdmin,
        page,
        limit
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
