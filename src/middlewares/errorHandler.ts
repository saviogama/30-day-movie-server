import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error.' });
}
