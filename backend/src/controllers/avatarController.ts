import { Request, Response } from 'express';
import { catchAsync } from '@/middleware/errorHandler';

export const avatarController = {
  // State
  getCurrentState: catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: { state: 'calm' }, timestamp: new Date().toISOString() });
  }),
  getStateHistory: catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: [], timestamp: new Date().toISOString() });
  }),
  updateState: catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'State updated (mock)', timestamp: new Date().toISOString() });
  }),

  // Insights
  getInsights: catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: { insights: [] }, timestamp: new Date().toISOString() });
  }),
  markInsightAsRead: catchAsync(async (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: `Insight ${req.params.id} marked as read (mock)`, timestamp: new Date().toISOString() });
  }),

  // Analytics
  getAnalytics: catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: { scores: [] }, timestamp: new Date().toISOString() });
  })
};
