import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { createTokens, setTokenCookies, refreshAccessToken } from '../services/authService.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.js';
import { mapIdToUnderscoreId } from '../utils/transform.js';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = registerSchema.parse(req.body);

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        first_name: validated.firstName,
        last_name: validated.lastName,
        role: validated.role || 'member',
      })
      .select('id, email, first_name, last_name, role')
      .single();

    if (error || !user) {
      res.status(500).json({ success: false, message: 'Registration failed' });
      return;
    }

    await supabaseAdmin.from('member_profiles').insert({ user_id: user.id });

    const tokens = createTokens({ _id: user.id, email: user.email, role: user.role });
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password, first_name, last_name, role, is_active')
      .eq('email', validated.email)
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(validated.password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.is_active) {
      res.status(401).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const tokens = createTokens({ _id: user.id, email: user.email, role: user.role });
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }
    const accessToken = await refreshAccessToken(refreshToken);
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .eq('id', req.user?.id)
      .single();

    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { data: profile } = await supabaseAdmin
      .from('member_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    res.json({ success: true, data: { user: mapIdToUnderscoreId(user), profile: profile ? mapIdToUnderscoreId(profile) : null } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = updateProfileSchema.parse(req.body);

    const userUpdates: Record<string, unknown> = {};
    if (validated.firstName) userUpdates.first_name = validated.firstName;
    if (validated.lastName) userUpdates.last_name = validated.lastName;

    const profileUpdates: Record<string, unknown> = {};
    if (validated.phone) profileUpdates.phone = validated.phone;
    if (validated.dateOfBirth) profileUpdates.date_of_birth = new Date(validated.dateOfBirth);
    if (validated.gender) profileUpdates.gender = validated.gender;
    if (validated.address) profileUpdates.address = validated.address;
    if (validated.emergencyContact) profileUpdates.emergency_contact = validated.emergencyContact;

    if (Object.keys(userUpdates).length > 0) {
      await supabaseAdmin
        .from('users')
        .update(userUpdates)
        .eq('id', req.user?.id);
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { data: profile } = await supabaseAdmin
        .from('member_profiles')
        .select('id')
        .eq('user_id', req.user?.id)
        .single();

      if (profile) {
        await supabaseAdmin
          .from('member_profiles')
          .update(profileUpdates)
          .eq('id', profile.id);
      }
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', req.user?.id)
      .single();

    const { data: profile } = await supabaseAdmin
      .from('member_profiles')
      .select('*')
      .eq('user_id', req.user?.id)
      .single();

    res.json({ success: true, data: { user: mapIdToUnderscoreId(user), profile: profile ? mapIdToUnderscoreId(profile) : null } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
