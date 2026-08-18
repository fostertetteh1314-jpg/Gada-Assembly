import { Router, Response } from 'express';
import { seedMockData, mockData } from '../config/mockDb.js';

seedMockData();

const delay = () => new Promise((r) => setTimeout(r, 100));

export const mockRouter = Router();

mockRouter.get('/health', (_req, res) => res.json({ success: true, message: 'Mock API running' }));

mockRouter.post('/auth/register', async (req, res) => {
  await delay();
  const { email, firstName, lastName } = req.body;
  const user = { _id: String(Date.now()), email, password: '', firstName, lastName, role: 'member', isActive: true };
  mockData.users.push(user);
  res.status(201).json({ success: true, data: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, accessToken: 'mock-token' });
});

mockRouter.post('/auth/login', async (req, res) => {
  await delay();
  const { email, password } = req.body;
  const user = mockData.users.find((u: any) => u.email === email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  res.json({ success: true, data: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, accessToken: 'mock-token' });
});

mockRouter.post('/auth/logout', (_req, res) => res.json({ success: true, message: 'Logged out' }));

mockRouter.get('/auth/me', (_req, res) => res.json({ success: true, data: { user: mockData.users[0], profile: mockData.profiles[0] } }));

mockRouter.put('/auth/profile', async (req, res) => {
  await delay();
  res.json({ success: true, data: { ...req.body, user: mockData.users[0], profile: mockData.profiles[0] } });
});

mockRouter.get('/settings', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.settings });
});

mockRouter.get('/sermons', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.sermons });
});

mockRouter.get('/sermons/:id', async (req, res) => {
  await delay();
  const sermon = mockData.sermons.find((s: any) => s._id === req.params.id);
  if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });
  res.json({ success: true, data: sermon });
});

mockRouter.post('/sermons', async (req, res) => {
  await delay();
  const sermon = { _id: String(Date.now()), ...req.body, createdBy: 'u2', createdAt: new Date() };
  mockData.sermons.push(sermon);
  res.status(201).json({ success: true, data: sermon });
});

mockRouter.put('/sermons/:id', async (req, res) => {
  await delay();
  const idx = mockData.sermons.findIndex((s: any) => s._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Sermon not found' });
  mockData.sermons[idx] = { ...mockData.sermons[idx], ...req.body };
  res.json({ success: true, data: mockData.sermons[idx] });
});

mockRouter.delete('/sermons/:id', async (req, res) => {
  await delay();
  const idx = mockData.sermons.findIndex((s: any) => s._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Sermon not found' });
  mockData.sermons.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

mockRouter.post('/events', async (req, res) => {
  await delay();
  const event = { _id: String(Date.now()), ...req.body, organizer: 'u2', createdAt: new Date() };
  mockData.events.push(event);
  res.status(201).json({ success: true, data: event });
});

mockRouter.put('/events/:id', async (req, res) => {
  await delay();
  const idx = mockData.events.findIndex((e: any) => e._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Event not found' });
  mockData.events[idx] = { ...mockData.events[idx], ...req.body };
  res.json({ success: true, data: mockData.events[idx] });
});

mockRouter.delete('/events/:id', async (req, res) => {
  await delay();
  const idx = mockData.events.findIndex((e: any) => e._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Event not found' });
  mockData.events.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

mockRouter.post('/announcements', async (req, res) => {
  await delay();
  const announcement = { _id: String(Date.now()), ...req.body, author: 'u1', createdAt: new Date() };
  mockData.announcements.push(announcement);
  res.status(201).json({ success: true, data: announcement });
});

mockRouter.put('/announcements/:id', async (req, res) => {
  await delay();
  const idx = mockData.announcements.findIndex((a: any) => a._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Announcement not found' });
  mockData.announcements[idx] = { ...mockData.announcements[idx], ...req.body };
  res.json({ success: true, data: mockData.announcements[idx] });
});

mockRouter.delete('/announcements/:id', async (req, res) => {
  await delay();
  const idx = mockData.announcements.findIndex((a: any) => a._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Announcement not found' });
  mockData.announcements.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

mockRouter.get('/events', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.events });
});

mockRouter.get('/events/:id', async (req, res) => {
  await delay();
  const event = mockData.events.find((e: any) => e._id === req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json({ success: true, data: event });
});

mockRouter.post('/events/:id/register', async (req, res) => {
  await delay();
  res.status(201).json({ success: true, message: 'Registered successfully', data: { ...req.body, event: req.params.id } });
});

mockRouter.get('/announcements', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.announcements });
});

mockRouter.get('/departments', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.departments });
});

mockRouter.get('/leaders', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.leaders });
});

mockRouter.get('/gallery', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/prayer-requests', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.post('/prayer-requests', async (req, res) => {
  await delay();
  const record = { _id: String(Date.now()), ...req.body, status: 'new', createdAt: new Date() };
  res.status(201).json({ success: true, data: record });
});

mockRouter.get('/notifications', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/giving', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/attendance', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/testimonies', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/members', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.profiles.map((p: any) => ({ ...p, user: mockData.users.find((u: any) => u._id === p.user) })) });
});

mockRouter.get('/users', async (_req, res) => {
  await delay();
  res.json({ success: true, data: mockData.users });
});

mockRouter.get('/reports/membership', async (_req, res) => {
  await delay();
  res.json({ success: true, data: { total: mockData.users.length, active: mockData.users.length } });
});

mockRouter.get('/reports/attendance', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.get('/reports/giving', async (_req, res) => {
  await delay();
  res.json({ success: true, data: [] });
});

mockRouter.post('/upload', async (req, res) => {
  await delay();
  res.status(201).json({ success: true, data: { url: 'https://via.placeholder.com/150' } });
});

export default mockRouter;
