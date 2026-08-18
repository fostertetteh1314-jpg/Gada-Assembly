CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'pastor', 'leader', 'member', 'visitor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  member_profile_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  date_of_birth TIMESTAMPTZ,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  profile_picture TEXT,
  membership_status TEXT NOT NULL DEFAULT 'visitor' CHECK (membership_status IN ('active', 'inactive', 'visitor')),
  department_id UUID,
  ministries UUID[],
  date_joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emergency_contact TEXT,
  skills TEXT[],
  is_profile_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS department_leaders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(department_id, user_id)
);

CREATE TABLE IF NOT EXISTS department_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(department_id, member_id)
);

CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  scripture TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail TEXT,
  audio_url TEXT,
  video_url TEXT,
  duration INT,
  tags TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  banner TEXT,
  organizer UUID NOT NULL REFERENCES users(id),
  category TEXT NOT NULL,
  registration_required BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  number_of_attendees INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  expires_at TIMESTAMPTZ,
  author UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject TEXT NOT NULL,
  request TEXT NOT NULL,
  category TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  preferred_follow_up TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'being_prayed_for', 'follow_up_required', 'resolved')),
  submitted_by UUID NOT NULL REFERENCES users(id),
  handled_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  testimony TEXT NOT NULL,
  submitted_by UUID NOT NULL REFERENCES users(id),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  permission_to_publish BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'visitor', 'first_timer', 'child')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, member_id)
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES member_profiles(id),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS church_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  church_name TEXT NOT NULL DEFAULT 'The Church of Pentecost',
  district TEXT NOT NULL DEFAULT 'Queen City District',
  assembly_name TEXT NOT NULL DEFAULT 'Gada Assembly',
  description TEXT,
  logo TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  service_times JSONB,
  social_links JSONB,
  giving_instructions TEXT,
  default_scripture JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_member_profiles_user_id ON member_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_gallery_items_album_id ON gallery_items(album_id);
CREATE INDEX IF NOT EXISTS idx_leaders_user_id ON leaders(user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published sermons" ON sermons FOR SELECT USING (is_published = true);
CREATE POLICY "Allow authenticated users to manage sermons" ON sermons FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow public read access to published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Allow authenticated users to manage events" ON events FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow public read access to active announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to manage announcements" ON announcements FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow public read access to approved testimonies" ON testimonies FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow authenticated users to create testimonies" ON testimonies FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Allow authenticated users to manage testimonies" ON testimonies FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow authenticated read access to prayer requests" ON prayer_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to create prayer requests" ON prayer_requests FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Allow authenticated users to manage prayer requests" ON prayer_requests FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow authenticated users to read own notifications" ON notifications FOR SELECT USING (auth.uid() = recipient);
CREATE POLICY "Allow authenticated users to update own notifications" ON notifications FOR UPDATE USING (auth.uid() = recipient);

CREATE POLICY "Allow public read access to leaders" ON leaders FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to manage leaders" ON leaders FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));

CREATE POLICY "Allow public read access to gallery albums" ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage gallery albums" ON gallery_albums FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow public read access to gallery items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage gallery items" ON gallery_items FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow authenticated read access to attendance sessions" ON attendance_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage attendance sessions" ON attendance_sessions FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow authenticated users to manage attendance records" ON attendance_records FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow authenticated read access to donations" ON donations FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));
CREATE POLICY "Allow authenticated users to create donations" ON donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage departments" ON departments FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));

CREATE POLICY "Allow public read access to member profiles" ON member_profiles FOR SELECT USING (is_profile_public = true OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));
CREATE POLICY "Allow authenticated users to manage member profiles" ON member_profiles FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor', 'leader')));

CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update users" ON users FOR UPDATE USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));
CREATE POLICY "Allow authenticated users to delete users" ON users FOR DELETE USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Allow authenticated read access to settings" ON church_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update settings" ON church_settings FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));

CREATE POLICY "Allow authenticated users to read audit logs" ON audit_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'pastor')));
CREATE POLICY "Allow authenticated users to create audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

INSERT INTO church_settings (church_name, district, assembly_name, description, phone, email, address, service_times, giving_instructions, default_scripture) VALUES (
  'The Church of Pentecost',
  'Queen City District',
  'Gada Assembly',
  'A family of believers committed to knowing Christ, growing together and reaching our community.',
  '+233 123 456 789',
  'info@gadaassembly.org',
  'Gada, Accra, Ghana',
  '{"Sunday Worship": "09:00 AM", "Midweek Service": "06:00 PM", "Prayer Meeting": "06:00 PM"}',
  'Give generously to the work of the Lord.',
  '{"text": "The Lord is my shepherd; I shall not want.", "reference": "Psalm 23:1"}'
) ON CONFLICT DO NOTHING;
