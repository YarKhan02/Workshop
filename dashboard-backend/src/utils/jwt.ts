import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any}); //applied patch here
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const extractTokenFromHeader = (authHeader: string): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }
  return authHeader.substring(7);
}; 