import { supabaseAdmin } from '../config/supabase.js';

export const getMembershipReport = async () => {
  const { count: total } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .in('role', ['member', 'leader', 'admin', 'pastor']);

  const { count: active } = await supabaseAdmin
    .from('member_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('membership_status', 'active');

  const { count: inactive } = await supabaseAdmin
    .from('member_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('membership_status', 'inactive');

  const { count: visitors } = await supabaseAdmin
    .from('member_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('membership_status', 'visitor');

  return { total: total || 0, active: active || 0, inactive: inactive || 0, visitors: visitors || 0 };
};

export const getAttendanceReport = async (sessionId?: string) => {
  let query = supabaseAdmin.from('attendance_records').select('status');
  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }
  const { data: records, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const breakdown: Record<string, number> = {};
  records?.forEach((r: any) => {
    breakdown[r.status] = (breakdown[r.status] || 0) + 1;
  });

  return { total: records?.length || 0, breakdown: Object.entries(breakdown).map(([status, count]) => ({ _id: status, count })) };
};

export const getEventsReport = async () => {
  const { count: total } = await supabaseAdmin
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: upcoming } = await supabaseAdmin
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('date', new Date().toISOString());

  return { total: total || 0, upcoming: upcoming || 0 };
};

export const getGivingReport = async () => {
  const { data: donations, error } = await supabaseAdmin
    .from('donations')
    .select('category, amount')
    .eq('status', 'completed');

  if (error) {
    throw new Error(error.message);
  }

  const byCategory: Record<string, { total: number; count: number }> = {};
  let totalAmount = 0;

  donations?.forEach((d: any) => {
    const amount = parseFloat(d.amount);
    totalAmount += amount;
    if (!byCategory[d.category]) {
      byCategory[d.category] = { total: 0, count: 0 };
    }
    byCategory[d.category].total += amount;
    byCategory[d.category].count += 1;
  });

  return {
    totalAmount,
    byCategory: Object.entries(byCategory).map(([category, data]) => ({ _id: category, total: data.total })),
  };
};
