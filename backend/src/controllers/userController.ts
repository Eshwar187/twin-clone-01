import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { User } from '@/models/User';
import { catchAsync, CustomError } from '@/middleware/errorHandler';

export const userController = {
  getProfile: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ status: 'success', data: { profile: req.user.profile }, timestamp: new Date().toISOString() });
  }),

  updateProfile: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const updates = (({ name }) => ({ name }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { profile: user?.profile }, timestamp: new Date().toISOString() });
  }),

  updateAvatar: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) throw new CustomError('Avatar file is required', 400);
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });
    res.status(200).json({ status: 'success', data: { avatar: user?.avatar }, timestamp: new Date().toISOString() });
  }),

  changePassword: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new CustomError('User not found', 404);

    const correct = await user.correctPassword(currentPassword, user.password);
    if (!correct) throw new CustomError('Current password is incorrect', 400);

    user.password = newPassword;
    await user.save();
    res.status(200).json({ status: 'success', message: 'Password updated', timestamp: new Date().toISOString() });
  }),

  getPreferences: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: 'success', data: { preferences: user?.preferences }, timestamp: new Date().toISOString() });
  }),

  updatePreferences: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findByIdAndUpdate(req.user._id, { preferences: req.body.preferences }, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { preferences: user?.preferences }, timestamp: new Date().toISOString() });
  }),

  deactivateAccount: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({ status: 'success', message: 'Account deactivated', timestamp: new Date().toISOString() });
  }),

  deleteAccount: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ status: 'success', message: 'Account deleted', timestamp: new Date().toISOString() });
  }),
};
