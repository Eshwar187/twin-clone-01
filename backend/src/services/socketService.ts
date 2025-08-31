import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { logger } from '@/utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export const setupSocketIO = (io: SocketIOServer): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.id);

      if (!user || !user.active) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected via WebSocket: ${socket.userId}`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Handle avatar state updates
    socket.on('avatar:update', (data) => {
      logger.debug(`Avatar update from user ${socket.userId}:`, data);
      // Broadcast to user's other sessions
      socket.to(`user:${socket.userId}`).emit('avatar:updated', data);
    });

    // Handle health data updates
    socket.on('health:update', (data) => {
      logger.debug(`Health update from user ${socket.userId}:`, data);
      socket.to(`user:${socket.userId}`).emit('health:updated', data);
    });

    // Handle budget updates
    socket.on('budget:update', (data) => {
      logger.debug(`Budget update from user ${socket.userId}:`, data);
      socket.to(`user:${socket.userId}`).emit('budget:updated', data);
    });

    // Handle bill splitting notifications
    socket.on('bills:join-group', (groupId) => {
      socket.join(`group:${groupId}`);
      logger.debug(`User ${socket.userId} joined bill group: ${groupId}`);
    });

    socket.on('bills:leave-group', (groupId) => {
      socket.leave(`group:${groupId}`);
      logger.debug(`User ${socket.userId} left bill group: ${groupId}`);
    });

    // Handle productivity updates
    socket.on('productivity:update', (data) => {
      logger.debug(`Productivity update from user ${socket.userId}:`, data);
      socket.to(`user:${socket.userId}`).emit('productivity:updated', data);
    });

    // Handle notes collaboration
    socket.on('notes:join-document', (noteId) => {
      socket.join(`note:${noteId}`);
      logger.debug(`User ${socket.userId} joined note: ${noteId}`);
    });

    socket.on('notes:leave-document', (noteId) => {
      socket.leave(`note:${noteId}`);
      logger.debug(`User ${socket.userId} left note: ${noteId}`);
    });

    socket.on('notes:typing', (data) => {
      socket.to(`note:${data.noteId}`).emit('notes:user-typing', {
        userId: socket.userId,
        username: socket.user.name,
        ...data
      });
    });

    // Handle calendar updates
    socket.on('calendar:update', (data) => {
      logger.debug(`Calendar update from user ${socket.userId}:`, data);
      socket.to(`user:${socket.userId}`).emit('calendar:updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.userId}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  // Utility functions for emitting to specific users/groups
  const emitToUser = (userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  const emitToGroup = (groupId: string, event: string, data: any) => {
    io.to(`group:${groupId}`).emit(event, data);
  };

  const emitToNote = (noteId: string, event: string, data: any) => {
    io.to(`note:${noteId}`).emit(event, data);
  };

  // Export utility functions
  (io as any).emitToUser = emitToUser;
  (io as any).emitToGroup = emitToGroup;
  (io as any).emitToNote = emitToNote;

  logger.info('✅ Socket.IO server initialized');
};
