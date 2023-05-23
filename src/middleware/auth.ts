import logger from '@src/logger';
import AuthService from '@src/services/auth';
import { NextFunction, Response, Request } from 'express';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.['x-access-token'];

  if (!token) {
    res.status?.(401).send({ code: 401, error: 'No token provided' });
  }

  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status?.(401).send({ code: 401, error: err.message });
    } else {
      res.status?.(401).send({ code: 401, error: 'Unkown auth error' });
    }
  }
}
