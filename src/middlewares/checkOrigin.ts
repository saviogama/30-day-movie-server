import { NextFunction, Request, Response } from 'express';

export function checkOrigin(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin') || req.get('referer') || '';
  const allowedOrigin = process.env.ALLOWED_ORIGIN_URL || '';

  const isAllowed = origin.toLowerCase() === allowedOrigin.toLowerCase();

  if (!isAllowed) {
    res.status(403).json({ error: 'Forbidden: Not allowed origin' });
    return;
  }

  next();
}
