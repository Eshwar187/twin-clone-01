import mongoose, { Schema } from 'mongoose';
import { IAvatarData, AvatarState } from '@/types';

const avatarDataSchema = new Schema<IAvatarData>({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  
  currentState: {
    type: String,
    enum: ['happy', 'stressed', 'calm', 'tired', 'energetic'],
    default: 'calm'
  },
  
  stateHistory: [{
    state: {
      type: String,
      enum: ['happy', 'stressed', 'calm', 'tired', 'energetic'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    factors: {
      health: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      finance: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      productivity: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      }
    }
  }],
  
  insights: [{
    type: {
      type: String,
      enum: ['health', 'finance', 'productivity', 'general'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
avatarDataSchema.index({ userId: 1 });
avatarDataSchema.index({ 'stateHistory.timestamp': -1 });
avatarDataSchema.index({ 'insights.read': 1, 'insights.priority': -1 });

// Virtual for unread insights count
avatarDataSchema.virtual('unreadInsightsCount').get(function() {
  return this.insights.filter(insight => !insight.read).length;
});

// Virtual for recent state changes (last 7 days)
avatarDataSchema.virtual('recentStateChanges').get(function() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.stateHistory.filter((entry: { timestamp: Date }) => entry.timestamp >= sevenDaysAgo);
});

// Method to add new state
avatarDataSchema.methods.addState = function(state: AvatarState, factors: { health: number; finance: number; productivity: number }) {
  this.currentState = state;
  this.stateHistory.push({
    state,
    timestamp: new Date(),
    factors
  });
  
  // Keep only last 100 state history entries
  if (this.stateHistory.length > 100) {
    this.stateHistory = this.stateHistory.slice(-100);
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add insight
avatarDataSchema.methods.addInsight = function(type: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  this.insights.push({
    type,
    message,
    priority,
    timestamp: new Date(),
    read: false
  });
  
  // Keep only last 50 insights
  if (this.insights.length > 50) {
    this.insights = this.insights.slice(-50);
  }
  
  return this.save();
};

// Method to mark insight as read
avatarDataSchema.methods.markInsightAsRead = function(insightId: string) {
  const insight = this.insights.id(insightId);
  if (insight) {
    insight.read = true;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to get state distribution
avatarDataSchema.methods.getStateDistribution = function(days: number = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentHistory = this.stateHistory.filter((entry: { timestamp: Date }) => entry.timestamp >= cutoffDate);
  
  const distribution: Record<AvatarState, number> = {
    happy: 0,
    stressed: 0,
    calm: 0,
    tired: 0,
    energetic: 0
  };
  
  recentHistory.forEach((entry: { state: AvatarState }) => {
    distribution[entry.state]++;
  });
  
  return distribution;
};

// Static method to calculate avatar state based on factors
avatarDataSchema.statics.calculateState = function(health: number, finance: number, productivity: number): AvatarState {
  const average = (health + finance + productivity) / 3;
  
  // Stressed conditions
  if (finance < 30 || health < 30) return 'stressed';
  
  // Tired conditions
  if (health < 50 && productivity < 50) return 'tired';
  
  // Energetic conditions
  if (health >= 80 && productivity >= 80 && finance >= 70) return 'energetic';
  
  // Happy conditions
  if (average >= 70) return 'happy';
  
  // Default to calm
  return 'calm';
};

export const AvatarData = mongoose.model<IAvatarData>('AvatarData', avatarDataSchema);
