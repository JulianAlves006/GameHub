import type { Response } from 'express';

import * as teamService from '../services/teamService.ts';

class TeamController {
  createTeam = async (req: any, res: Response) => {
    try {
      const name = req.body.name;
      const logo = req.file.buffer;
      const response = await teamService.createTeam(name, logo, req.user.id);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateTeam = async (req: any, res: Response) => {
    try {
      const logo = req.file?.buffer || null;
      const response = await teamService.updateTeam(req.body, logo, req.user);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTeams = async (req: any, res: Response) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const idTeam = parseInt(req.query.id) || null;
      const idAdmin = parseInt(req.query.idAdmin) || null;

      // Validar parâmetros
      if (page < 1) {
        return res.status(400).json({ error: 'Página deve ser maior que 0' });
      }
      if (limit < 1 || limit > 100) {
        return res
          .status(400)
          .json({ erro: 'Limite deve estar entre 1 e 100' });
      }

      const response = await teamService.getTeams(page, limit, idTeam, idAdmin);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTeamLogo = async (req: any, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).send('ID inválido');
      const team = await teamService.getTeamLogo(id);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', String((team.logo as any).length));
      return res.send(team.logo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default new TeamController();
