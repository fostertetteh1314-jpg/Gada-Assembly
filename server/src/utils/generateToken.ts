import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};
