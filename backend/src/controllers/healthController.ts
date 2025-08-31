import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { HealthData } from '@/models/HealthData';
import { catchAsync, CustomError } from '@/middleware/errorHandler';

const getTodayKey = () => {
  const d = new Date(); d.setHours(0,0,0,0); return d;
};

export const healthController = {
  getDashboard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const latest = await HealthData.findOne({ userId: req.user._id }).sort({ date: -1 });
    const averages = await (HealthData as any).getAverageMetrics(req.user._id, 30);
    res.status(200).json({ status: 'success', data: { latest, averages }, timestamp: new Date().toISOString() });
  }),

  getHealthData: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const data = await HealthData.find({ userId: req.user._id }).sort({ date: -1 }).limit(60);
    res.status(200).json({ status: 'success', data, timestamp: new Date().toISOString() });
  }),

  createHealthData: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const payload = { ...req.body, userId: req.user._id };
    const created = await HealthData.create(payload);
    res.status(201).json({ status: 'success', data: created, timestamp: new Date().toISOString() });
  }),

  updateHealthData: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { date: dateParam } = req.params as { date?: string };
    if (!dateParam) throw new CustomError('Date parameter is required', 400);
    const date = new Date(dateParam);
    const updated = await HealthData.findOneAndUpdate({ userId: req.user._id, date }, req.body, { new: true, runValidators: true });
    if (!updated) throw new CustomError('Health data not found for date', 404);
    res.status(200).json({ status: 'success', data: updated, timestamp: new Date().toISOString() });
  }),

  logWater: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { amount } = req.body as { amount: number };
    let doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) doc = await HealthData.create({ userId: req.user._id, date: getTodayKey(), sleep: { hours: 0, quality: 3 }, mood: { rating: 3 } });
    await (doc as any).addWater(amount || 1);
    res.status(200).json({ status: 'success', data: doc, timestamp: new Date().toISOString() });
  }),

  getWaterStats: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const days = await (HealthData as any).getHealthTrends(req.user._id, 14);
    const stats = days.map((d: any) => ({ date: d.date, consumed: d.water.consumed, goal: d.water.goal }));
    res.status(200).json({ status: 'success', data: stats, timestamp: new Date().toISOString() });
  }),

  logSleep: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { hours, quality, bedtime, wakeTime } = req.body;
    const date = getTodayKey();
    const updated = await HealthData.findOneAndUpdate(
      { userId: req.user._id, date },
      { $set: { sleep: { hours, quality, bedtime, wakeTime } } },
      { new: true, upsert: true }
    );
    res.status(200).json({ status: 'success', data: updated, timestamp: new Date().toISOString() });
  }),

  getSleepStats: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const days = await (HealthData as any).getHealthTrends(req.user._id, 30);
    const stats = days.map((d: any) => ({ date: d.date, hours: d.sleep.hours, quality: d.sleep.quality }));
    res.status(200).json({ status: 'success', data: stats, timestamp: new Date().toISOString() });
  }),

  logExercise: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { steps, workout } = req.body as any;
    let doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) doc = await HealthData.create({ userId: req.user._id, date: getTodayKey(), sleep: { hours: 0, quality: 3 }, mood: { rating: 3 } });
    if (typeof steps === 'number') doc.exercise.steps = steps;
    if (workout?.type && workout?.duration) await (doc as any).addWorkout(workout.type, workout.duration, workout.calories);
    await doc.save();
    res.status(200).json({ status: 'success', data: doc, timestamp: new Date().toISOString() });
  }),

  getExerciseStats: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const days = await (HealthData as any).getHealthTrends(req.user._id, 30);
    const stats = days.map((d: any) => ({ date: d.date, steps: d.exercise.steps, workouts: d.exercise.workouts.length }));
    res.status(200).json({ status: 'success', data: stats, timestamp: new Date().toISOString() });
  }),

  getHabits: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const docs = await HealthData.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);
    const habits = docs.flatMap((d: any) => d.habits || []);
    res.status(200).json({ status: 'success', data: habits, timestamp: new Date().toISOString() });
  }),

  createHabit: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    // Habit model not implemented; we store completion entries on HealthData
    const { habitId } = req.body;
    let doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) doc = await HealthData.create({ userId: req.user._id, date: getTodayKey(), sleep: { hours: 0, quality: 3 }, mood: { rating: 3 } });
    doc.habits.push({ habitId, completed: false, timestamp: new Date() } as any);
    await doc.save();
    res.status(201).json({ status: 'success', data: doc.habits, timestamp: new Date().toISOString() });
  }),

  updateHabit: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params; // habitId
    const doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) throw new CustomError('No health data for today', 404);
    const h = doc.habits.find((x: any) => x.habitId === id);
    if (!h) throw new CustomError('Habit not found', 404);
    Object.assign(h, req.body);
    await doc.save();
    res.status(200).json({ status: 'success', data: h, timestamp: new Date().toISOString() });
  }),

  deleteHabit: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) throw new CustomError('No health data for today', 404);
    doc.habits = doc.habits.filter((x: any) => x.habitId !== id) as any;
    await doc.save();
    res.status(204).json();
  }),

  completeHabit: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const doc = await HealthData.findOne({ userId: req.user._id, date: getTodayKey() });
    if (!doc) throw new CustomError('No health data for today', 404);
    await (doc as any).completeHabit(id);
    res.status(200).json({ status: 'success', data: doc.habits, timestamp: new Date().toISOString() });
  }),

  getAnalytics: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const averages = await (HealthData as any).getAverageMetrics(req.user._id, 60);
    res.status(200).json({ status: 'success', data: { averages }, timestamp: new Date().toISOString() });
  }),

  getTrends: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const trends = await (HealthData as any).getHealthTrends(req.user._id, 60);
    res.status(200).json({ status: 'success', data: trends, timestamp: new Date().toISOString() });
  }),
};
