import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import SermonDetail from './pages/SermonDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Announcements from './pages/Announcements';
import Prayer from './pages/Prayer';
import Contact from './pages/Contact';
import NewHere from './pages/NewHere';
import ConnectCard from './pages/ConnectCard';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import MemberProfilePage from './pages/MemberProfile';
import MyAttendance from './pages/MyAttendance';
import MyGiving from './pages/MyGiving';
import MyPrayerRequests from './pages/MyPrayerRequests';
import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/AdminMembers';
import AdminSermons from './pages/AdminSermons';
import AdminEvents from './pages/AdminEvents';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminPrayerRequests from './pages/AdminPrayerRequests';
import AdminTestimonies from './pages/AdminTestimonies';
import AdminAttendance from './pages/AdminAttendance';
import AdminGiving from './pages/AdminGiving';
import AdminDepartments from './pages/AdminDepartments';
import AdminGallery from './pages/AdminGallery';
import AdminLeaders from './pages/AdminLeaders';
import AdminNotifications from './pages/AdminNotifications';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="sermons" element={<Sermons />} />
              <Route path="sermons/:id" element={<SermonDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="prayer" element={<Prayer />} />
              <Route path="contact" element={<Contact />} />
              <Route path="new-here" element={<NewHere />} />
              <Route path="connect-card" element={<ConnectCard />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/member" element={<ProtectedRoute allowedRoles={['member', 'leader', 'admin', 'pastor']} />}>
              <Route index element={<Navigate to="/member/dashboard" replace />} />
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="profile" element={<MemberProfilePage />} />
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="giving" element={<MyGiving />} />
              <Route path="prayer-requests" element={<MyPrayerRequests />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'pastor']} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="sermons" element={<AdminSermons />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="prayer-requests" element={<AdminPrayerRequests />} />
                <Route path="testimonies" element={<AdminTestimonies />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="giving" element={<AdminGiving />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="leaders" element={<AdminLeaders />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
