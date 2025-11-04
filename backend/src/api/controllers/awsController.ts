import { type Request, type Response } from 'express';
import type {
  PresignUploadBody,
  PresignReadQuery,
  DeleteBody,
} from '../../types.js';
import * as awsService from '../services/awsService.ts';

class awsController {
  createImg = async (
    req: Request<unknown, unknown, PresignUploadBody>,
    res: Response
  ) => {
    try {
      const response = await awsService.createImg(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getUrl = async (
    req: Request<unknown, unknown, unknown, PresignReadQuery>,
    res: Response
  ) => {
    try {
      const response = await awsService.getUrl(req.query);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteImg = async (
    req: Request<unknown, unknown, DeleteBody>,
    res: Response
  ) => {
    try {
      const response = await awsService.deleteImg(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
export default new awsController();
