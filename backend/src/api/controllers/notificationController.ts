import type { Response } from 'express';
import * as NotificationHandler from '../handlers/notificationHandler.ts';

class NotificationsController {
  getNotifications = async (req: any, res: Response) => {
    try {
      const response = await NotificationHandler.getNotificationHandler(
        req.user.id
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createNotifications = async (req: any, res: Response) => {
    try {
      const type = req.body.type;
      const user_id = req.body.user_id;
      const gamer_id = req.body.gamer_id;
      const description = req.body.description;
      const teamID = req.body.teamID ?? req.body.team ?? null;
      const response = await NotificationHandler.createNotificationHandler(
        type,
        user_id,
        gamer_id,
        description,
        teamID
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  editNotifications = async (req: any, res: Response) => {
    try {
      const response = await NotificationHandler.editNotificationHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}

export default new NotificationsController();
