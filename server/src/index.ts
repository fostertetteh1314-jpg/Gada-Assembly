import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import membersRoutes from './routes/members.js';
import departmentsRoutes from './routes/departments.js';
import sermonsRoutes from './routes/sermons.js';
import eventsRoutes from './routes/events.js';
import announcementsRoutes from './routes/announcements.js';
import prayerRequestsRoutes from './routes/prayerRequests.js';
import testimoniesRoutes from './routes/testimonies.js';
import attendanceRoutes from './routes/attendance.js';
import givingRoutes from './routes/giving.js';
import notificationsRoutes from './routes/notifications.js';
import galleryRoutes from './routes/gallery.js';
import leadersRoutes from './routes/leaders.js';
import reportsRoutes from './routes/reports.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import mockRoutes from './routes/mockRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { transformResponse } from './middleware/transformResponse.js';
import { supabase, supabaseAdmin } from './config/supabase.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Gada Assembly API is healthy' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    app.set('supabase', supabase);
    app.set('supabaseAdmin', supabaseAdmin);

    console.log('Supabase client initialized');
    app.use('/api/auth', authRoutes);
    app.use('/api/users', transformResponse, usersRoutes);
    app.use('/api/members', transformResponse, membersRoutes);
    app.use('/api/departments', transformResponse, departmentsRoutes);
    app.use('/api/sermons', transformResponse, sermonsRoutes);
    app.use('/api/events', transformResponse, eventsRoutes);
    app.use('/api/announcements', transformResponse, announcementsRoutes);
    app.use('/api/prayer-requests', transformResponse, prayerRequestsRoutes);
    app.use('/api/testimonies', transformResponse, testimoniesRoutes);
    app.use('/api/attendance', transformResponse, attendanceRoutes);
    app.use('/api/giving', transformResponse, givingRoutes);
    app.use('/api/notifications', transformResponse, notificationsRoutes);
    app.use('/api/gallery', transformResponse, galleryRoutes);
    app.use('/api/leaders', transformResponse, leadersRoutes);
    app.use('/api/reports', transformResponse, reportsRoutes);
    app.use('/api/settings', transformResponse, settingsRoutes);
    app.use('/api/upload', uploadRoutes);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Supabase initialization error:', err);
    console.warn('Starting mock server for development...');
    app.use('/api/', mockRoutes);
    app.listen(PORT, () => {
      console.log(`Mock server running on port ${PORT}`);
    });
  }
};

startServer();
