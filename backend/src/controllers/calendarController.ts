import { Response } from 'express';
import { catchAsync } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { CalendarEvent } from '@/models/CalendarEvent';
import { Task } from '@/models/Task';

export const calendarController = {
  // Overview
  getDashboard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [todayEventsCount, openTasksCount, completedTasksCount] = await Promise.all([
      CalendarEvent.countDocuments({ userId, startTime: { $lte: endOfDay }, endTime: { $gte: startOfDay } }),
      Task.countDocuments({ userId, completed: false }),
      Task.countDocuments({ userId, completed: true })
    ]);

    res.status(200).json({ status: 'success', data: { summary: { todayEventsCount, openTasksCount, completedTasksCount } }, timestamp: new Date().toISOString() });
  }),

  // Events
  getEvents: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { start, end } = (req.query || {}) as { start?: string; end?: string };
    const filter: any = { userId };
    if (start || end) {
      filter.startTime = {};
      if (start) filter.startTime.$gte = new Date(start);
      if (end) filter.startTime.$lte = new Date(end);
    }
    const events = await CalendarEvent.find(filter).sort({ startTime: 1 });
    res.status(200).json({ status: 'success', data: events, timestamp: new Date().toISOString() });
  }),
  createEvent: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const payload = { ...req.body, userId };
    const created = await CalendarEvent.create(payload);
    res.status(201).json({ status: 'success', data: created, timestamp: new Date().toISOString() });
  }),
  getEvent: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const event = await CalendarEvent.findOne({ _id: req.params.id, userId });
    res.status(200).json({ status: 'success', data: event, timestamp: new Date().toISOString() });
  }),
  updateEvent: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const updated = await CalendarEvent.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: updated, timestamp: new Date().toISOString() });
  }),
  deleteEvent: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    await CalendarEvent.findOneAndDelete({ _id: req.params.id, userId });
    res.status(204).json();
  }),

  // Tasks
  getTasks: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: tasks, timestamp: new Date().toISOString() });
  }),
  createTask: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const payload = { ...req.body, userId };
    const created = await Task.create(payload);
    res.status(201).json({ status: 'success', data: created, timestamp: new Date().toISOString() });
  }),
  updateTask: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const updated = await Task.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: updated, timestamp: new Date().toISOString() });
  }),
  deleteTask: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    await Task.findOneAndDelete({ _id: req.params.id, userId });
    res.status(204).json();
  }),
  completeTask: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const updated = await Task.findOneAndUpdate({ _id: req.params.id, userId }, { completed: true, completedAt: new Date() }, { new: true });
    res.status(200).json({ status: 'success', data: updated, timestamp: new Date().toISOString() });
  }),

  // Analytics
  getProductivityStats: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const [totalTasks, completedTasks, upcomingEvents] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, completed: true }),
      CalendarEvent.countDocuments({ userId, startTime: { $gte: new Date() } })
    ]);
    res.status(200).json({ status: 'success', data: { stats: { totalTasks, completedTasks, upcomingEvents } }, timestamp: new Date().toISOString() });
  }),
  getTimeTracking: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const tasks = await Task.find({ userId, actualDuration: { $gt: 0 } }).select('title actualDuration updatedAt');
    const entries = tasks.map(t => ({
      title: t.title,
      minutes: t.actualDuration,
      date: t.updatedAt
    }));
    res.status(200).json({ status: 'success', data: { entries }, timestamp: new Date().toISOString() });
  })
};
