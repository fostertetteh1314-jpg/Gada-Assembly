import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/supabase.js';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    const hashedAdmin = await bcrypt.hash('admin123', 12);
    const hashedPastor = await bcrypt.hash('pastor123', 12);
    const hashedLeader = await bcrypt.hash('leader123', 12);
    const hashedMember = await bcrypt.hash('member123', 12);

    const { data: admin, error: adminError } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'admin@gadaassembly.org',
        password: hashedAdmin,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
      })
      .select('id')
      .single();

    if (adminError) throw adminError;

    const { data: pastor, error: pastorError } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'pastor@gadaassembly.org',
        password: hashedPastor,
        first_name: 'Pastor',
        last_name: 'Kwame',
        role: 'pastor',
      })
      .select('id')
      .single();

    if (pastorError) throw pastorError;

    const { data: leader, error: leaderError } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'leader@gadaassembly.org',
        password: hashedLeader,
        first_name: 'Deacon',
        last_name: 'Ama',
        role: 'leader',
      })
      .select('id')
      .single();

    if (leaderError) throw leaderError;

    const { data: member1, error: member1Error } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'member1@gadaassembly.org',
        password: hashedMember,
        first_name: 'Kofi',
        last_name: 'Mensah',
        role: 'member',
      })
      .select('id')
      .single();

    if (member1Error) throw member1Error;

    const { data: member2, error: member2Error } = await supabaseAdmin
      .from('users')
      .insert({
        email: 'member2@gadaassembly.org',
        password: hashedMember,
        first_name: 'Abena',
        last_name: 'Owusu',
        role: 'member',
      })
      .select('id')
      .single();

    if (member2Error) throw member2Error;

    const { data: profile1, error: profile1Error } = await supabaseAdmin
      .from('member_profiles')
      .insert({
        user_id: member1.id,
        phone: '0244123456',
        gender: 'male',
        membership_status: 'active',
        address: '123 Main St, Accra',
        date_joined: new Date('2020-01-15'),
      })
      .select('id')
      .single();

    if (profile1Error) throw profile1Error;

    const { data: profile2, error: profile2Error } = await supabaseAdmin
      .from('member_profiles')
      .insert({
        user_id: member2.id,
        phone: '0209876543',
        gender: 'female',
        membership_status: 'active',
        address: '456 Oak St, Accra',
        date_joined: new Date('2021-06-20'),
      })
      .select('id')
      .single();

    if (profile2Error) throw profile2Error;

    const { data: youthDept, error: youthDeptError } = await supabaseAdmin
      .from('departments')
      .insert({ name: 'Youth Ministry', description: 'Raising the next generation of leaders' })
      .select('id')
      .single();

    if (youthDeptError) throw youthDeptError;

    const { data: childrenDept, error: childrenDeptError } = await supabaseAdmin
      .from('departments')
      .insert({ name: "Children's Ministry", description: 'Nurturing young hearts' })
      .select('id')
      .single();

    if (childrenDeptError) throw childrenDeptError;

    const { data: musicDept, error: musicDeptError } = await supabaseAdmin
      .from('departments')
      .insert({ name: 'Music Ministry', description: 'Leading worship through music' })
      .select('id')
      .single();

    if (musicDeptError) throw musicDeptError;

    await supabaseAdmin.from('department_leaders').insert([
      { department_id: youthDept.id, user_id: leader.id },
      { department_id: musicDept.id, user_id: leader.id },
    ]);

    await supabaseAdmin.from('department_members').insert([
      { department_id: youthDept.id, member_id: profile1.id },
      { department_id: youthDept.id, member_id: profile2.id },
      { department_id: musicDept.id, member_id: profile1.id },
    ]);

    await supabaseAdmin.from('sermons').insert([
      {
        title: 'Walking in Faith',
        speaker: 'Pastor Kwame',
        date: new Date('2025-01-12'),
        scripture: 'Hebrews 11:1-6',
        description: "A powerful message about stepping out in faith and trusting God's plan for your life.",
        category: 'Faith',
        tags: ['faith', 'trust', 'obedience'],
        is_published: true,
        created_by: pastor.id,
      },
      {
        title: 'The Power of Prayer',
        speaker: 'Pastor Kwame',
        date: new Date('2025-01-19'),
        scripture: 'James 5:13-18',
        description: 'Understanding the transformative power of consistent prayer in our walk with God.',
        category: 'Prayer',
        tags: ['prayer', 'power', 'intercession'],
        is_published: true,
        created_by: pastor.id,
      },
      {
        title: 'Building Healthy Families',
        speaker: 'Deacon Ama',
        date: new Date('2025-01-26'),
        scripture: 'Ephesians 6:1-4',
        description: 'Practical guidance for building strong, godly families in today\'s world.',
        category: 'Family',
        tags: ['family', 'relationships', 'home'],
        is_published: true,
        created_by: leader.id,
      },
    ]);

    const { data: event1, error: event1Error } = await supabaseAdmin
      .from('events')
      .insert({
        name: 'Sunday Service',
        description: 'Weekly Sunday worship service with powerful teaching and fellowship.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        start_time: '08:00',
        end_time: '11:00',
        location: 'Main Sanctuary',
        category: 'Worship',
        registration_required: false,
        is_published: true,
        organizer: pastor.id,
      })
      .select('id')
      .single();

    if (event1Error) throw event1Error;

    const { data: event2, error: event2Error } = await supabaseAdmin
      .from('events')
      .insert({
        name: 'Youth Conference 2025',
        description: 'Annual youth conference with inspiring speakers and activities.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        start_time: '09:00',
        end_time: '16:00',
        location: 'Conference Center',
        category: 'Conference',
        registration_required: true,
        is_published: true,
        organizer: admin.id,
      })
      .select('id')
      .single();

    if (event2Error) throw event2Error;

    const { data: event3, error: event3Error } = await supabaseAdmin
      .from('events')
      .insert({
        name: 'Prayer & Fasting Night',
        description: 'Special night of prayer and fasting for spiritual renewal.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        start_time: '18:00',
        end_time: '22:00',
        location: 'Main Sanctuary',
        category: 'Prayer',
        registration_required: false,
        is_published: true,
        organizer: pastor.id,
      })
      .select('id')
      .single();

    if (event3Error) throw event3Error;

    await supabaseAdmin.from('announcements').insert([
      { title: 'Welcome to Gada Assembly', content: 'We are glad you are here. Join us every Sunday for worship and fellowship.', priority: 'high', author: admin.id, is_active: true },
      { title: 'Youth Conference Registration Open', content: 'Register now for our annual youth conference. Limited spots available.', priority: 'medium', author: admin.id, is_active: true },
      { title: 'Weekly Prayer Meeting', content: 'Join us every Wednesday evening for our mid-week prayer meeting at 6 PM.', priority: 'low', author: pastor.id, is_active: true },
    ]);

    await supabaseAdmin.from('leaders').insert([
      { user_id: leader.id, position: 'Youth Leader', bio: 'Deacon Ama has been serving the youth ministry for over 5 years, passionate about raising godly leaders.', is_active: true },
      { user_id: pastor.id, position: 'Senior Pastor', bio: 'Pastor Kwame has been leading Gada Assembly with vision and compassion for over 15 years.', is_active: true },
    ]);

    await supabaseAdmin.from('church_settings').insert({
      church_name: 'The Church of Pentecost',
      district: 'Queen City District',
      assembly_name: 'Gada Assembly',
      description: 'A vibrant assembly of believers committed to spreading the gospel and building a strong community of faith.',
      phone: '+233 24 123 4567',
      email: 'info@gadaassembly.org',
      address: 'Gada, Accra, Ghana',
      service_times: { Sunday: '08:00', Wednesday: '18:00', Friday: '06:00' },
      social_links: { facebook: 'https://facebook.com/gadaassembly', instagram: 'https://instagram.com/gadaassembly' },
      giving_instructions: 'You can give via mobile money, bank transfer, or in person at our Sunday services.',
      default_scripture: { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', reference: 'Jeremiah 29:11' },
    });

    console.log('Database seeded successfully');
    console.log('Admin: admin@gadaassembly.org / admin123');
    console.log('Pastor: pastor@gadaassembly.org / pastor123');
    console.log('Leader: leader@gadaassembly.org / leader123');
    console.log('Member: member1@gadaassembly.org / member123');
    console.log('Member: member2@gadaassembly.org / member123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
