import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUser } from '@/types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  
  avatar: {
    type: String,
    default: null
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      avatar: { type: Boolean, default: true },
      health: { type: Boolean, default: true },
      budget: { type: Boolean, default: true },
      bills: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
      },
      dataSharing: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// 'email' already has `unique: true` on the schema field; avoid duplicate index definition
userSchema.index({ active: 1 });
userSchema.index({ emailVerified: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    emailVerified: this.emailVerified,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  this.password = await bcrypt.hash(this.password, saltRounds);

  // Set passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }

  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

// Static method to find user by reset token
userSchema.statics.findByPasswordResetToken = function(token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
};

// Static method to find user by email verification token
userSchema.statics.findByEmailVerificationToken = function(token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });
};

export const User = mongoose.model<IUser>('User', userSchema);
