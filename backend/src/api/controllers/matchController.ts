import type { Response } from 'express';
import * as matchHandler from '../handlers/matchesHandler.ts';

class MatchController {
  getMatchesPlayingFinished = async (req: any, res: Response) => {
    try {
      const response = await matchHandler.getMatchesCountHandler();
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getMatches = async (req: any, res: Response) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const idChampionship = parseInt(req.query.idChampionship) || undefined;
      const idMatch = parseInt(req.query.idMatch) || undefined;
      const idTeam = parseInt(req.query.idTeam) || undefined;
      const search = req.query.search || undefined;

      // Validar parâmetros
      if (page < 1) {
        return res.status(400).json({ erro: 'Página deve ser maior que 0' });
      }
      if (limit < 1 || limit > 100) {
        return res
          .status(400)
          .json({ erro: 'Limite deve estar entre 1 e 100' });
      }
      const response = await matchHandler.getMatchesHandler(
        page,
        limit,
        idChampionship as number,
        idMatch as number,
        idTeam as number,
        search
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createMatch = async (req: any, res: Response) => {
    try {
      const response = await matchHandler.createMatchHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateMatch = async (req: any, res: Response) => {
    try {
      const response = await matchHandler.updateMatchHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteMatch = async (req: any, res: Response) => {
    try {
      const response = await matchHandler.deleteMatchHandler(
        req.query.id,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new MatchController();
