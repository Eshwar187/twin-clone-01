import mongoose, { Schema } from 'mongoose';
import { ICalendarEvent } from '@/types';

const calendarEventSchema = new Schema<ICalendarEvent>({
  userId: { type: String, required: true, ref: 'User', index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  location: { type: String },
  attendees: [{ type: String }],
  category: { type: String, enum: ['work', 'personal', 'health', 'social'], default: 'personal' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  reminders: [{
    type: { type: String, enum: ['email', 'push', 'sms'], required: true },
    minutesBefore: { type: Number, required: true }
  }],
  recurring: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: { type: Number, default: 1 },
    endDate: { type: Date }
  },
  status: { type: String, enum: ['confirmed', 'tentative', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

calendarEventSchema.index({ userId: 1, startTime: 1 });

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);
