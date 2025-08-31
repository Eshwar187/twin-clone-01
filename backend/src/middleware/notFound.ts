import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/middleware/errorHandler';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(
    `🤖 Your digital twin couldn't locate the endpoint: ${req.originalUrl}. Please check the API documentation.`,
    404
  );
  next(error);
};
