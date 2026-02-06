import type { Response } from 'express';

import * as teamHandler from '../handlers/teamHandler.ts';

class TeamController {
  createTeam = async (req: any, res: Response) => {
    try {
      const name = req.body.name;
      const logo = req.file.buffer;
      const contentType = req.file.mimetype;
      const response = await teamHandler.createTeamHandler(
        name,
        logo,
        contentType,
        req.user.id
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateTeam = async (req: any, res: Response) => {
    try {
      const logo = req.file?.buffer || null;
      const contentType = req.file?.mimetype || null;
      const response = await teamHandler.updateTeamHandler(
        req.body,
        logo,
        contentType,
        req.user
      );
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
      const search = req.query.search || null;

      // Validar parâmetros
      if (page < 1) {
        return res.status(400).json({ error: 'Página deve ser maior que 0' });
      }
      if (limit < 1 || limit > 100) {
        return res
          .status(400)
          .json({ erro: 'Limite deve estar entre 1 e 100' });
      }

      const response = await teamHandler.getTeamsHandler(
        page,
        limit,
        idTeam as number,
        idAdmin as number,
        search as string | null
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTeamLogo = async (req: any, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).send('ID inválido');
      const team = await teamHandler.getTeamLogoHandler(id);
      // Redireciona para a presigned URL do S3 (válida por 1 hora)
      return res.redirect(team.logoUrl);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default new TeamController();
