import { NextFunction, Request, Response } from 'express';

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header('x-api-key');

  if (!key || key !== process.env.INTERNAL_API_KEY) {
    res.status(401).json({ error: 'Unauthorized: invalid API key' });
    return;
  }

  next();
}
