import mongoose, { Schema } from 'mongoose';
import { ITask } from '@/types';

const taskSchema = new Schema<ITask>({
  userId: { type: String, required: true, ref: 'User', index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  category: { type: String, required: true },
  tags: [{ type: String }],
  estimatedDuration: { type: Number },
  actualDuration: { type: Number },
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

taskSchema.index({ userId: 1, completed: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
