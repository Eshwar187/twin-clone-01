import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '@/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME; // optional explicit DB name
    if (!MONGODB_URI) {
      logger.error('❌ MONGODB_URI environment variable is not set.');
      process.exit(1);
    }

    const baseOptions: ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const optionsWithDb = DB_NAME ? ({ ...baseOptions, dbName: DB_NAME } as ConnectOptions) : baseOptions;

    await mongoose.connect(MONGODB_URI as string, optionsWithDb);

    logger.info('✅ Connected to MongoDB successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('🔒 MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};
