import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  active: boolean;
  emailVerified: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      avatar: boolean;
      health: boolean;
      budget: boolean;
      bills: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      dataSharing: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  createEmailVerificationToken(): string;
}

// Avatar Types
export type AvatarState = 'happy' | 'stressed' | 'calm' | 'tired' | 'energetic';

export interface IAvatarData extends Document {
  userId: string;
  currentState: AvatarState;
  stateHistory: Array<{
    state: AvatarState;
    timestamp: Date;
    factors: {
      health: number;
      finance: number;
      productivity: number;
    };
  }>;
  insights: Array<{
    type: 'health' | 'finance' | 'productivity' | 'general';
    message: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: Date;
    read: boolean;
  }>;
  lastUpdated: Date;
}

// Health Types
export interface IHealthData extends Document {
  userId: string;
  date: Date;
  water: {
    consumed: number;
    goal: number;
  };
  sleep: {
    hours: number;
    quality: 1 | 2 | 3 | 4 | 5;
    bedtime?: Date;
    wakeTime?: Date;
  };
  exercise: {
    steps: number;
    workouts: Array<{
      type: string;
      duration: number;
      calories?: number;
      timestamp: Date;
    }>;
  };
  habits: Array<{
    habitId: string;
    completed: boolean;
    timestamp?: Date;
  }>;
  mood: {
    rating: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  };
  vitals?: {
    weight?: number;
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
  };
}

export interface IHabit extends Document {
  userId: string;
  name: string;
  description?: string;
  category: 'health' | 'productivity' | 'personal' | 'social';
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  streak: number;
  longestStreak: number;
  active: boolean;
  createdAt: Date;
}

// Budget Types
export interface IBudgetCategory extends Document {
  userId: string;
  name: string;
  budgetAmount: number;
  spent: number;
  color: string;
  icon: string;
  active: boolean;
  createdAt: Date;
}

export interface IExpense extends Document {
  userId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
  tags: string[];
  receipt?: string;
  location?: {
    name: string;
    coordinates: [number, number];
  };
  recurring?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
  };
  createdAt: Date;
}

// Bills Types
export interface IBillGroup extends Document {
  name: string;
  description?: string;
  members: Array<{
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
  }>;
  active: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface IBill extends Document {
  groupId: string;
  title: string;
  description?: string;
  totalAmount: number;
  paidBy: string;
  participants: Array<{
    userId: string;
    amount: number;
    paid: boolean;
    paidAt?: Date;
  }>;
  category: string;
  date: Date;
  receipt?: string;
  status: 'pending' | 'settled' | 'cancelled';
  createdAt: Date;
}

export interface ISettlement extends Document {
  fromUserId: string;
  toUserId: string;
  amount: number;
  billIds: string[];
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
  completedAt?: Date;
  createdAt: Date;
}

// Notes Types
export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  category: 'note' | 'journal' | 'meeting' | 'idea';
  shared: boolean;
  sharedWith: string[];
  attachments: Array<{
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;
  lastEditedAt: Date;
  createdAt: Date;
}

// Calendar Types
export interface ICalendarEvent extends Document {
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  location?: string;
  attendees: string[];
  category: 'work' | 'personal' | 'health' | 'social';
  priority: 'low' | 'medium' | 'high';
  reminders: Array<{
    type: 'email' | 'push' | 'sms';
    minutesBefore: number;
  }>;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  status: 'confirmed' | 'tentative' | 'cancelled';
  createdAt: Date;
}

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
  tags: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  subtasks: Array<{
    title: string;
    completed: boolean;
  }>;
  completedAt?: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}
