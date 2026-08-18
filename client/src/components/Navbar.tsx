import { Link } from 'react-router-dom';
import { Home, Users, Calendar, Mic, Heart, BookOpen, User, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: BookOpen },
  { path: '/sermons', label: 'Sermons', icon: Mic },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/prayer', label: 'Prayer', icon: Heart },
];

const memberNavItems = [
  { path: '/member/dashboard', label: 'Dashboard', icon: Home },
  { path: '/member/profile', label: 'Profile', icon: User },
  { path: '/member/attendance', label: 'Attendance', icon: Calendar },
  { path: '/member/giving', label: 'Giving', icon: Heart },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor';

  return (
    <nav className="bg-church-primary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/church-logo.jpg" alt="Gada Assembly Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg leading-tight">Gada Assembly</div>
              <div className="text-xs text-church-secondary leading-tight">The Church of Pentecost</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="hover:text-church-secondary transition-colors flex items-center gap-1">
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/member/dashboard" className="hover:text-church-secondary transition-colors">My Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-church-secondary transition-colors">Admin</Link>
                )}
                <button onClick={logout} className="hover:text-church-secondary transition-colors">Logout</button>
              </>
            )}
            {!user && (
              <Link to="/login" className="bg-church-secondary text-church-text px-4 py-2 rounded-md hover:bg-church-secondary-light transition-colors">Login</Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="block py-2 hover:text-church-secondary" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

  export const Footer = () => {
    return (
      <footer className="bg-church-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                  <img src="/church-logo.jpg" alt="Gada Assembly Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg leading-tight">Gada Assembly</div>
                  <div className="text-xs text-church-secondary leading-tight">The Church of Pentecost</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Queen City District, Gada Assembly. A vibrant community of believers called to impact our world.</p>
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold mb-4 text-church-secondary">Service Times</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Sunday Worship: 8:00 AM</li>
                <li>Wednesday Prayer: 6:00 PM</li>
                <li>Friday Fasting: 6:00 AM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold mb-4 text-church-secondary">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Gada, Accra, Ghana</li>
                <li>+233 24 123 4567</li>
                <li>info@gadaassembly.org</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            Gada Assembly - The Church of Pentecost. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };

export const MobileNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-church-primary/10 md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        <Link to="/" className="flex flex-col items-center text-church-primary">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/sermons" className="flex flex-col items-center text-gray-500 hover:text-church-primary">
          <Mic size={20} />
          <span className="text-xs mt-1">Sermons</span>
        </Link>
        <Link to="/events" className="flex flex-col items-center text-gray-500 hover:text-church-primary">
          <Calendar size={20} />
          <span className="text-xs mt-1">Events</span>
        </Link>
        {user && (
          <Link to="/member/dashboard" className="flex flex-col items-center text-gray-500 hover:text-church-primary">
            <User size={20} />
            <span className="text-xs mt-1">Me</span>
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin/dashboard" className="flex flex-col items-center text-gray-500 hover:text-church-primary">
            <Settings size={20} />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
