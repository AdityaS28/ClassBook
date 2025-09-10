import { Router, Request, Response, NextFunction } from "express";

export const metrics = {
  requestCount: 0,
};

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  metrics.requestCount++;
  next();
};

const router = Router();

router.get("/metrics", (req: Request, res: Response) => {
  res.json(metrics);
});

export default router;
