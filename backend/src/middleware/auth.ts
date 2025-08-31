import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { CustomError, catchAsync } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1) Getting token and check if it's there
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.auth('No token provided', undefined, req.ip, req.get('User-Agent'));
    throw new CustomError('You are not logged in! Please log in to get access.', 401);
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+active');
  if (!currentUser) {
    logger.auth('Token valid but user not found', decoded.id, req.ip, req.get('User-Agent'));
    throw new CustomError('The user belonging to this token does no longer exist.', 401);
  }

  // 4) Check if user is active
  if (!currentUser.active) {
    logger.auth('Inactive user attempted access', decoded.id, req.ip, req.get('User-Agent'));
    throw new CustomError('Your account has been deactivated. Please contact support.', 401);
  }

  // 5) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    logger.auth('Password changed after token issued', decoded.id, req.ip, req.get('User-Agent'));
    throw new CustomError('User recently changed password! Please log in again.', 401);
  }

  // Grant access to protected route
  req.user = currentUser;
  logger.auth('Successful authentication', currentUser._id.toString(), req.ip, req.get('User-Agent'));
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      logger.auth(`Insufficient permissions - Role: ${req.user.role}`, req.user._id, req.ip, req.get('User-Agent'));
      throw new CustomError('You do not have permission to perform this action', 403);
    }
    next();
  };
};

export const optionalAuth = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const currentUser = await User.findById(decoded.id).select('+active');
      
      if (currentUser && currentUser.active && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but that's okay for optional auth
      logger.debug('Invalid token in optional auth', { error: (error as Error).message });
    }
  }

  next();
});
