import type { Response } from 'express';
import * as metricHandler from '../handlers/metricHandler.ts';

class MetricController {
  getMetric = async (req: any, res: Response) => {
    try {
      const response = await metricHandler.getMetricHandler(req.params);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  createMetric = async (req: any, res: Response) => {
    try {
      const response = await metricHandler.createMetricHandler(
        req.body,
        req.user
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default new MetricController();
