import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.js';
import { departmentSchema, addMemberSchema } from '../validators/departments.js';

export const getAllDepartments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch departments' });
      return;
    }

    const departmentsWithLeaders = await Promise.all(
      (departments || []).map(async (dept: any) => {
        const { data: leaders } = await supabaseAdmin
          .from('department_leaders')
          .select('user:users(id, first_name, last_name, email)')
          .eq('department_id', dept.id);
        return { ...dept, leaders: leaders?.map((l: any) => l.user) || [] };
      })
    );

    res.json({ success: true, data: departmentsWithLeaders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

export const getDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: department, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !department) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }

    const { data: leaders } = await supabaseAdmin
      .from('department_leaders')
      .select('user:users(id, first_name, last_name, email)')
      .eq('department_id', department.id);

    res.json({ success: true, data: { ...department, leaders: leaders?.map((l: any) => l.user) || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch department' });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = departmentSchema.parse(req.body);
    const { data: department, error } = await supabaseAdmin
      .from('departments')
      .insert({
        name: validated.name,
        description: validated.description,
      })
      .select('*')
      .single();

    if (error || !department) {
      res.status(500).json({ success: false, message: 'Failed to create department' });
      return;
    }

    if (validated.leaders && validated.leaders.length > 0) {
      const leaderRecords = validated.leaders.map((userId) => ({
        department_id: department.id,
        user_id: userId,
      }));
      await supabaseAdmin.from('department_leaders').insert(leaderRecords);
    }

    const { data: leaders } = await supabaseAdmin
      .from('department_leaders')
      .select('user:users(id, first_name, last_name, email)')
      .eq('department_id', department.id);

    res.status(201).json({ success: true, data: { ...department, leaders: leaders?.map((l: any) => l.user) || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = departmentSchema.parse(req.body);
    const { data: department, error } = await supabaseAdmin
      .from('departments')
      .update({
        name: validated.name,
        description: validated.description,
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !department) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }

    await supabaseAdmin.from('department_leaders').delete().eq('department_id', req.params.id);
    if (validated.leaders && validated.leaders.length > 0) {
      const leaderRecords = validated.leaders.map((userId) => ({
        department_id: department.id,
        user_id: userId,
      }));
      await supabaseAdmin.from('department_leaders').insert(leaderRecords);
    }

    const { data: leaders } = await supabaseAdmin
      .from('department_leaders')
      .select('user:users(id, first_name, last_name, email)')
      .eq('department_id', department.id);

    res.json({ success: true, data: { ...department, leaders: leaders?.map((l: any) => l.user) || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update department' });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('departments')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete department' });
  }
};

export const addMemberToDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = addMemberSchema.parse(req.body);

    const { data: department, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id, members')
      .eq('id', req.params.id)
      .single();

    if (deptError || !department) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }

    const currentMembers = department.members || [];
    if (currentMembers.includes(memberId)) {
      res.status(400).json({ success: false, message: 'Member already in department' });
      return;
    }

    await supabaseAdmin.from('department_members').insert({
      department_id: req.params.id,
      member_id: memberId,
    });

    const { data: updatedDept } = await supabaseAdmin
      .from('departments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    res.json({ success: true, data: updatedDept });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add member' });
  }
};

export const removeMemberFromDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: department, error } = await supabaseAdmin
      .from('departments')
      .select('id, members')
      .eq('id', req.params.id)
      .single();

    if (error || !department) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }

    const currentMembers = department.members || [];
    const updatedMembers = currentMembers.filter((m: string) => m !== req.params.memberId);

    await supabaseAdmin
      .from('departments')
      .update({ members: updatedMembers })
      .eq('id', req.params.id);

    await supabaseAdmin
      .from('department_members')
      .delete()
      .eq('department_id', req.params.id)
      .eq('member_id', req.params.memberId);

    const { data: updatedDept } = await supabaseAdmin
      .from('departments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    res.json({ success: true, data: updatedDept });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove member' });
  }
};
