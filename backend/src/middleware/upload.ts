import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CustomError } from '@/middleware/errorHandler';

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || 'uploads/';
    try {
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
    } catch (e) {
      // Provide both parameters as required by diskStorage callback signature
      return cb(new Error('Failed to initialize upload directory'), uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject the file without throwing a typed error to satisfy TypeScript signature
    cb(null, false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
    files: 5
  }
});

// Avatar upload (images only)
const avatarFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const avatarUpload = multer({
  storage,
  fileFilter: avatarFilter,
  limits: {
    fileSize: 2097152, // 2MB for avatars
    files: 1
  }
});
