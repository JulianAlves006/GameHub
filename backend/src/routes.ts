import { Router } from 'express';
import multer from 'multer';

import UserController from './api/controllers/usersController.ts';
import loginController from './api/controllers/loginController.ts';

import { authMiddleware } from './middlewares/tokenMiddleware.ts';
import GamerController from './api/controllers/gamerController.ts';
import TeamController from './api/controllers/teamController.ts';
import championshipController from './api/controllers/championshipController.ts';
import awardController from './api/controllers/awardController.ts';
import matchController from './api/controllers/matchController.ts';
import awardChampionshipController from './api/controllers/awardChampionshipController.ts';
import notificationController from './api/controllers/notificationController.ts';
import metricController from './api/controllers/metricController.ts';
import awsController from './api/controllers/awsController.ts';

export const routes = Router();

const BUCKET = process.env.S3_BUCKET!;
const PREFIX = process.env.S3_PUBLIC_PREFIX || '';
const EXPIRES = Number(process.env.SIGNED_URL_EXPIRES || 300);

function ensureImageMime(mime: string) {
  // ajuste conforme sua regra
  return /^image\/(png|jpe?g|webp|gif|avif)$/.test(mime);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Apenas imagens são permitidas'));
  },
});

//Rotas de login ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.post('/login', loginController.login);

//Rotas de usuários ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/user', authMiddleware, UserController.getUser);
routes.post('/user', UserController.createUser);
routes.put('/user', authMiddleware, UserController.updateUser);
routes.delete('/user', authMiddleware, UserController.deleteUser);

//Rotas de gamers ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/gamer', GamerController.getGamers);
routes.post('/gamer', GamerController.createGamer);
routes.put('/gamer', GamerController.updateGamer);
routes.delete('/gamer', GamerController.deleteGamer);

//Rotas de gamers ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/team', TeamController.getTeams);
routes.get('/team/:id/logo', TeamController.getTeamLogo);
routes.post(
  '/team',
  upload.single('logo'),
  authMiddleware,
  TeamController.createTeam
);
routes.put(
  '/team',
  upload.single('logo'),
  authMiddleware,
  TeamController.updateTeam
);

//Rotas de campeonatos ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/championship', championshipController.getChampionship);
routes.post(
  '/championship',
  authMiddleware,
  championshipController.createChampionship
);
routes.put(
  '/championship',
  authMiddleware,
  championshipController.updateChampionship
);
routes.delete(
  '/championship',
  authMiddleware,
  championshipController.deleteChampionship
);

//Rotas de premios  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/award', awardController.getAwards);
routes.post('/award', authMiddleware, awardController.createAward);
routes.put('/award', authMiddleware, awardController.updateAward);
routes.delete('/award', authMiddleware, awardController.deleteAward);

//Rotas de awardsChampionships  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get(
  '/awardChampionship',
  authMiddleware,
  awardChampionshipController.getAwardChampionship
);

routes.delete(
  '/awardChampionship',
  authMiddleware,
  awardChampionshipController.deleteAwardChampionship
);

//Rotas de partidas  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/match', matchController.getMatches);
routes.post('/match', authMiddleware, matchController.createMatch);
routes.put('/match', authMiddleware, matchController.updateMatch);
routes.delete('/match', authMiddleware, matchController.deleteMatch);

//Rotas de notificações  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get(
  '/notifications',
  authMiddleware,
  notificationController.getNotifications
);

routes.post(
  '/notifications',
  authMiddleware,
  notificationController.createNotifications
);

routes.put(
  '/notifications',
  authMiddleware,
  notificationController.editNotifications
);

//Rotas de metricas  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.get('/metric', metricController.getMetric);

routes.post('/metric', authMiddleware, metricController.createMetric);

//Rotas do s3  ---------------------------------------------------------------------------------------------------------------------------------------------------
routes.post('/s3/presign-upload', authMiddleware, awsController.createImg);

// 2) Gerar URL de leitura
routes.get('/s3/presign-read', awsController.getUrl);

// 3) Deletar objeto
routes.delete('/s3/object', awsController.deleteImg);
