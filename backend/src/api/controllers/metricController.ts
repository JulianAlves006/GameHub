import type { Response } from 'express';
import * as metricService from '../services/metricService.ts';

class MetricController {
  getMetric = async (req: any, res: Response) => {
    try {
      const response = await metricService.getMetric(req.params);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  createMetric = async (req: any, res: Response) => {
    try {
      const response = await metricService.createMetric(req.body, req.user);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default new MetricController();
