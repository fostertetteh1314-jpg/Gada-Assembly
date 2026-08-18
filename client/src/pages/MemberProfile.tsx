import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MemberProfile } from '../types';
import { User } from 'lucide-react';

export default () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', address: '', emergencyContact: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data.data.profile);
        setFormData({
          firstName: res.data.data.user.firstName,
          lastName: res.data.data.user.lastName,
          phone: res.data.data.profile?.phone || '',
          address: res.data.data.profile?.address || '',
          emergencyContact: res.data.data.profile?.emergencyContact || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put('/auth/profile', formData);
      setMessage('Profile updated successfully');
      if (user) {
        updateUser({ ...user, firstName: formData.firstName, lastName: formData.lastName });
      }
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Profile</h1>
          <p className="text-gray-200">Manage your personal information</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
