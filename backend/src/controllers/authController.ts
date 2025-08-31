import { Request, Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '@/models/User';
import { catchAsync, CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const signToken = (id: string, secret: Secret, expiresIn: string | number) => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ id }, secret, options);
};

const sendAuthResponse = (res: Response, user: any, accessToken: string, refreshToken?: string) => {
  const { password, active, __v, ...safe } = user.toObject ? user.toObject() : user;
  return res.status(200).json({
    status: 'success',
    data: {
      user: safe,
      token: accessToken,
      refreshToken,
    },
    timestamp: new Date().toISOString(),
  });
};

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new CustomError('Email already registered', 400);

    const user = await User.create({ name, email, password });

    const accessToken = signToken(user.id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN || '7d');
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN || '30d');

    logger.info(`New user registered: ${email}`);
    return sendAuthResponse(res, user, accessToken, refreshToken);
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +active');
    if (!user) throw new CustomError('Incorrect email or password', 401);
    if (!user.active) throw new CustomError('Account is deactivated', 401);

    const correct = await user.correctPassword(password, user.password);
    if (!correct) throw new CustomError('Incorrect email or password', 401);

    const accessToken = signToken(user.id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN || '7d');
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN || '30d');

    return sendAuthResponse(res, user, accessToken, refreshToken);
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    // Stateless JWT; client should discard token
    return res.status(200).json({ status: 'success', message: 'Logged out', timestamp: new Date().toISOString() });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) throw new CustomError('Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.id).select('+active');
    if (!user || !user.active) throw new CustomError('Invalid refresh token', 401);

    const accessToken = signToken(user.id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN || '7d');
    return sendAuthResponse(res, user, accessToken, refreshToken);
  }),

  forgotPassword: catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
    if (!user) throw new CustomError('No user found with that email', 404);

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // In real app, send email. Here we log the token for development.
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({ status: 'success', message: 'Password reset token generated', timestamp: new Date().toISOString() });
  }),

  resetPassword: catchAsync(async (req: Request, res: Response) => {
    const { token } = req.params as { token: string };
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } }).select('+password');
    if (!user) throw new CustomError('Token is invalid or has expired', 400);

    user.password = password;
    user.passwordResetToken = undefined as any;
    user.passwordResetExpires = undefined as any;
    await user.save();

    const accessToken = signToken(user.id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN || '7d');
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN || '30d');
    return sendAuthResponse(res, user, accessToken, refreshToken);
  }),

  sendEmailVerification: catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpires');
    if (!user) throw new CustomError('No user found with that email', 404);

    const verifyToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verification token for ${email}: ${verifyToken}`);
    res.status(200).json({ status: 'success', message: 'Verification email queued', timestamp: new Date().toISOString() });
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    const { token } = req.params as { token: string };
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ emailVerificationToken: hashed, emailVerificationExpires: { $gt: Date.now() } });
    if (!user) throw new CustomError('Token is invalid or has expired', 400);

    user.emailVerified = true;
    (user as any).emailVerificationToken = undefined;
    (user as any).emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', message: 'Email verified', timestamp: new Date().toISOString() });
  }),
};
