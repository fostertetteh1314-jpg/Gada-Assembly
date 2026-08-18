import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Users,
  Mic,
  Calendar,
  Megaphone,
  Heart,
  CheckCircle,
  ClipboardList,
  DollarSign,
  FolderOpen,
  Crown,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

const adminMenuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/members', label: 'Members', icon: Users },
  { path: '/admin/sermons', label: 'Sermons', icon: Mic },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/admin/prayer-requests', label: 'Prayer Requests', icon: Heart },
  { path: '/admin/testimonies', label: 'Testimonies', icon: CheckCircle },
  { path: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { path: '/admin/giving', label: 'Giving', icon: DollarSign },
  { path: '/admin/departments', label: 'Departments', icon: FolderOpen },
  { path: '/admin/gallery', label: 'Gallery', icon: FolderOpen },
  { path: '/admin/leaders', label: 'Leaders', icon: Crown },
  { path: '/admin/reports', label: 'Reports', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-church-background">
      <aside className="w-64 bg-church-text text-white hidden md:block">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/church-logo.jpg" alt="Gada Assembly Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg leading-tight">Gada Assembly</div>
              <div className="text-xs text-church-secondary">Admin Panel</div>
            </div>
          </div>
          <nav className="space-y-1">
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-md transition-colors',
                    isActive ? 'bg-church-primary text-church-secondary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )
                }
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white w-full">
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
