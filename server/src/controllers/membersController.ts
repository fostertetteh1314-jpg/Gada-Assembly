import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { memberSchema, updateMemberSchema } from '../validators/members.js';

export const getAllMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('member_profiles')
      .select('*, user:users(id, first_name, last_name, email, role)')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch members' });
      return;
    }
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
};

export const getMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('member_profiles')
      .select('*, user:users(id, first_name, last_name, email, role, created_at)')
      .eq('id', req.params.id)
      .single();

    if (error || !profile) {
      res.status(404).json({ success: false, message: 'Member not found' });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch member' });
  }
};

export const createMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = memberSchema.parse(req.body);

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: validated.email,
        password: hashedPassword,
        first_name: validated.firstName,
        last_name: validated.lastName,
        role: 'member',
      })
      .select('id, email, first_name, last_name, role')
      .single();

    if (userError || !user) {
      res.status(500).json({ success: false, message: 'Failed to create member' });
      return;
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('member_profiles')
      .insert({
        user_id: user.id,
        phone: validated.phone,
        date_of_birth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        gender: validated.gender,
        address: validated.address,
        membership_status: validated.membershipStatus || 'visitor',
        emergency_contact: validated.emergencyContact,
        skills: validated.skills,
        is_profile_public: validated.isProfilePublic || false,
      })
      .select('*')
      .single();

    if (profileError || !profile) {
      res.status(500).json({ success: false, message: 'Failed to create member' });
      return;
    }

    res.status(201).json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create member' });
  }
};

export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = updateMemberSchema.parse(req.body);

    const profileUpdates: Record<string, unknown> = {};
    if (validated.phone) profileUpdates.phone = validated.phone;
    if (validated.dateOfBirth) profileUpdates.date_of_birth = new Date(validated.dateOfBirth);
    if (validated.gender) profileUpdates.gender = validated.gender;
    if (validated.address) profileUpdates.address = validated.address;
    if (validated.membershipStatus) profileUpdates.membership_status = validated.membershipStatus;
    if (validated.emergencyContact) profileUpdates.emergency_contact = validated.emergencyContact;
    if (validated.skills) profileUpdates.skills = validated.skills;
    if (validated.isProfilePublic !== undefined) profileUpdates.is_profile_public = validated.isProfilePublic;

    const { data: profile, error } = await supabaseAdmin
      .from('member_profiles')
      .update(profileUpdates)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !profile) {
      res.status(404).json({ success: false, message: 'Member not found' });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update member' });
  }
};

export const deleteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('member_profiles')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (error || !profile) {
      res.status(404).json({ success: false, message: 'Member not found' });
      return;
    }

    await supabaseAdmin.from('member_profiles').delete().eq('id', req.params.id);
    await supabaseAdmin.from('users').delete().eq('id', profile.user_id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete member' });
  }
};
