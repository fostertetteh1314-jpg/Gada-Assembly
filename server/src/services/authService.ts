import jwt from 'jsonwebtoken';
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../utils/generateToken.js';
import { supabaseAdmin } from '../config/supabase.js';
import { Response } from 'express';

export const createTokens = (user: { _id: string; email: string; role: string }): { accessToken: string; refreshToken: string } => {
  const accessToken = generateToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const decoded = verifyRefreshToken(refreshToken);
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, is_active')
    .eq('id', decoded.id)
    .single();

  if (error || !user || !user.is_active) {
    throw new Error('Invalid refresh token');
  }
  return generateToken(user.id);
};
