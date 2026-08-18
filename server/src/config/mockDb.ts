type Doc = Record<string, unknown> & { _id?: string };

const collections = new Map<string, Doc[]>();
const indexes = new Map<string, Set<string>>();
let seq = 1;

function col(name: string) {
  if (!collections.has(name)) {
    collections.set(name, []);
    indexes.set(name, new Set());
  }
  return { data: collections.get(name)!, idx: indexes.get(name)! };
}

function makeId() {
  return String(seq++);
}

function findById(name: string, id: string) {
  return col(name).data.find((d) => d._id === id) || null;
}

function filter(name: string, predicate: (d: Doc) => boolean) {
  return col(name).data.filter(predicate);
}

function insert(name: string, doc: Doc) {
  const c = col(name);
  const record = { ...doc, _id: doc._id || makeId(), createdAt: doc.createdAt || new Date(), updatedAt: doc.updatedAt || new Date() };
  c.data.push(record);
  c.idx.add(record._id!);
  return record;
}

function update(name: string, id: string, patch: Doc) {
  const c = col(name);
  const idx = c.data.findIndex((d) => d._id === id);
  if (idx === -1) return null;
  c.data[idx] = { ...c.data[idx], ...patch, _id: c.data[idx]._id, updatedAt: new Date() };
  return c.data[idx];
}

function remove(name: string, id: string) {
  const c = col(name);
  const idx = c.data.findIndex((d) => d._id === id);
  if (idx === -1) return false;
  c.data.splice(idx, 1);
  c.idx.delete(id);
  return true;
}

function sortByDate(name: string, field = 'createdAt', desc = true) {
  const data = [...col(name).data];
  data.sort((a, b) => {
    const av = new Date(a[field] as string | Date).getTime();
    const bv = new Date(b[field] as string | Date).getTime();
    return desc ? bv - av : av - bv;
  });
  return data;
}

export const db = {
  col,
  findById,
  filter,
  insert,
  update,
  remove,
  sortByDate,
  reset() {
    collections.clear();
    indexes.clear();
    seq = 1;
  },
};

const hash = (s: string) => s;

const users = [
  { _id: 'u1', email: 'admin@gadaassembly.org', password: hash('admin123'), firstName: 'Admin', lastName: 'User', role: 'admin', isActive: true },
  { _id: 'u2', email: 'pastor@gadaassembly.org', password: hash('pastor123'), firstName: 'Pastor', lastName: 'Leader', role: 'pastor', isActive: true },
  { _id: 'u3', email: 'leader@gadaassembly.org', password: hash('leader123'), firstName: 'Dept', lastName: 'Leader', role: 'leader', isActive: true },
  { _id: 'u4', email: 'member1@gadaassembly.org', password: hash('member123'), firstName: 'Foster', lastName: 'Member', role: 'member', isActive: true },
];

const profiles = [
  { _id: 'p1', user: 'u1', membershipStatus: 'active' },
  { _id: 'p2', user: 'u2', membershipStatus: 'active' },
  { _id: 'p3', user: 'u3', membershipStatus: 'active' },
  { _id: 'p4', user: 'u4', membershipStatus: 'active' },
];

const departments = [
  { _id: 'd1', name: 'Youth Ministry', description: 'Youth activities', leaders: ['u3'], members: [] },
  { _id: 'd2', name: 'Women\'s Movement', description: 'Women ministry', leaders: [], members: [] },
];

const sermons = [
  { _id: 's1', title: 'Walking in Faith', speaker: 'Pastor Leader', date: new Date('2025-08-10'), scripture: 'Hebrews 11:1', description: 'A powerful message on faith.', category: 'Sunday Service', isPublished: true, createdBy: 'u2' },
  { _id: 's2', title: 'The Power of Prayer', speaker: 'Pastor Leader', date: new Date('2025-08-03'), scripture: 'James 5:16', description: 'Effectual prayer moves mountains.', category: 'Prayer', isPublished: true, createdBy: 'u2' },
];

const events = [
  { _id: 'e1', name: 'Sunday Worship', description: 'Weekly Sunday service', date: new Date('2025-08-17'), startTime: '09:00', endTime: '11:00', location: 'Gada Assembly Auditorium', category: 'Sunday Service', registrationRequired: false, isPublished: true, organizer: 'u2' },
  { _id: 'e2', name: 'Midweek Service', description: 'Wednesday prayer and worship', date: new Date('2025-08-20'), startTime: '18:00', endTime: '19:30', location: 'Gada Assembly Auditorium', category: 'Prayer Meeting', registrationRequired: false, isPublished: true, organizer: 'u2' },
];

const announcements = [
  { _id: 'a1', title: 'Welcome to Gada Assembly', content: 'We are glad to have you here. Join us this Sunday.', priority: 'high', author: 'u1', isActive: true },
  { _id: 'a2', title: 'Youth Revival', content: 'Youth revival meeting this Friday at 6PM.', priority: 'medium', author: 'u2', isActive: true },
];

const leaders = [
  { _id: 'l1', user: 'u2', position: 'Resident Pastor', bio: 'Leading the church with love and wisdom.', isActive: true },
];

const settings = {
  _id: 'c1',
  churchName: 'The Church of Pentecost',
  district: 'Queen City District',
  assemblyName: 'Gada Assembly',
  description: 'A family of believers committed to knowing Christ, growing together and reaching our community.',
  phone: '+233 123 456 789',
  email: 'info@gadaassembly.org',
  address: 'Gada, Accra, Ghana',
  serviceTimes: { 'Sunday Worship': '09:00 AM', 'Midweek Service': '06:00 PM', 'Prayer Meeting': '06:00 PM' },
  givingInstructions: 'Give generously to the work of the Lord.',
  defaultScripture: { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1' },
};

export function seedMockData() {
  for (const u of users) insert('users', u);
  for (const p of profiles) insert('memberProfiles', p);
  for (const d of departments) insert('departments', d);
  for (const s of sermons) insert('sermons', s);
  for (const e of events) insert('events', e);
  for (const a of announcements) insert('announcements', a);
  for (const l of leaders) insert('leaders', l);
  insert('settings', settings);
}

export const mockData = {
  users,
  profiles,
  departments,
  sermons,
  events,
  announcements,
  leaders,
  settings,
};
