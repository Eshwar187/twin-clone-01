import mongoose, { Schema } from 'mongoose';
import { IHealthData } from '@/types';

const healthDataSchema = new Schema<IHealthData>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
  },
  
  water: {
    consumed: {
      type: Number,
      min: 0,
      max: 20,
      default: 0
    },
    goal: {
      type: Number,
      min: 1,
      max: 20,
      default: 8
    }
  },
  
  sleep: {
    hours: {
      type: Number,
      min: 0,
      max: 24,
      required: true
    },
    quality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    bedtime: {
      type: Date
    },
    wakeTime: {
      type: Date
    }
  },
  
  exercise: {
    steps: {
      type: Number,
      min: 0,
      max: 100000,
      default: 0
    },
    workouts: [{
      type: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        min: 1,
        required: true
      },
      calories: {
        type: Number,
        min: 0
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  habits: [{
    habitId: {
      type: String,
      required: true,
      ref: 'Habit'
    },
    completed: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  mood: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  
  vitals: {
    weight: {
      type: Number,
      min: 20,
      max: 500
    },
    heartRate: {
      type: Number,
      min: 30,
      max: 220
    },
    bloodPressure: {
      systolic: {
        type: Number,
        min: 70,
        max: 250
      },
      diastolic: {
        type: Number,
        min: 40,
        max: 150
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user and date (unique per user per day)
healthDataSchema.index({ userId: 1, date: 1 }, { unique: true });
healthDataSchema.index({ userId: 1, createdAt: -1 });

// Virtual for water completion percentage
healthDataSchema.virtual('waterCompletionPercentage').get(function() {
  return Math.min((this.water.consumed / this.water.goal) * 100, 100);
});

// Virtual for total workout duration
healthDataSchema.virtual('totalWorkoutDuration').get(function() {
  return this.exercise.workouts.reduce((total, workout) => total + workout.duration, 0);
});

// Virtual for total calories burned
healthDataSchema.virtual('totalCaloriesBurned').get(function() {
  return this.exercise.workouts.reduce((total, workout) => total + (workout.calories || 0), 0);
});

// Virtual for completed habits count
healthDataSchema.virtual('completedHabitsCount').get(function() {
  return this.habits.filter(habit => habit.completed).length;
});

// Virtual for health score (0-100)
healthDataSchema.virtual('healthScore').get(function() {
  let score = 0;
  let factors = 0;
  
  // Water score (25%)
  const waterScore = Math.min((this.water.consumed / this.water.goal) * 100, 100);
  score += waterScore * 0.25;
  factors++;
  
  // Sleep score (35%)
  const sleepScore = Math.min((this.sleep.hours / 8) * 100, 100) * (this.sleep.quality / 5);
  score += sleepScore * 0.35;
  factors++;
  
  // Exercise score (25%)
  const stepsScore = Math.min((this.exercise.steps / 10000) * 100, 100);
  const workoutBonus = this.exercise.workouts.length > 0 ? 20 : 0;
  const exerciseScore = Math.min(stepsScore + workoutBonus, 100);
  score += exerciseScore * 0.25;
  factors++;
  
  // Mood score (15%)
  const moodScore = (this.mood.rating / 5) * 100;
  score += moodScore * 0.15;
  factors++;
  
  return Math.round(score);
});

// Method to add water intake
healthDataSchema.methods.addWater = function(amount: number) {
  this.water.consumed = Math.min(this.water.consumed + amount, this.water.goal * 2);
  return this.save();
};

// Method to add workout
healthDataSchema.methods.addWorkout = function(type: string, duration: number, calories?: number) {
  this.exercise.workouts.push({
    type,
    duration,
    calories,
    timestamp: new Date()
  });
  return this.save();
};

// Method to complete habit
healthDataSchema.methods.completeHabit = function(habitId: string) {
  const habit = this.habits.find(h => h.habitId === habitId);
  if (habit) {
    habit.completed = true;
    habit.timestamp = new Date();
  } else {
    this.habits.push({
      habitId,
      completed: true,
      timestamp: new Date()
    });
  }
  return this.save();
};

// Static method to get health trends
healthDataSchema.statics.getHealthTrends = async function(userId: string, days: number = 30) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Static method to get average health metrics
healthDataSchema.statics.getAverageMetrics = async function(userId: string, days: number = 30) {
  const trends = await this.getHealthTrends(userId, days);
  
  if (trends.length === 0) return null;
  
  const totals = trends.reduce((acc, day) => {
    acc.water += day.water.consumed;
    acc.sleep += day.sleep.hours;
    acc.steps += day.exercise.steps;
    acc.mood += day.mood.rating;
    acc.workouts += day.exercise.workouts.length;
    return acc;
  }, { water: 0, sleep: 0, steps: 0, mood: 0, workouts: 0 });
  
  const count = trends.length;
  
  return {
    averageWater: Math.round((totals.water / count) * 10) / 10,
    averageSleep: Math.round((totals.sleep / count) * 10) / 10,
    averageSteps: Math.round(totals.steps / count),
    averageMood: Math.round((totals.mood / count) * 10) / 10,
    totalWorkouts: totals.workouts,
    daysTracked: count
  };
};

export const HealthData = mongoose.model<IHealthData>('HealthData', healthDataSchema);
