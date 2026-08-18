import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseAnonKey || 'anon-key');

export const supabaseAdmin = createClient(supabaseUrl || 'http://localhost:54321', supabaseServiceRoleKey || 'service-role-key');
