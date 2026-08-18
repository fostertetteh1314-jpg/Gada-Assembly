import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { api } from '../lib/api';
import { ChurchSettings } from '../types';
import { Settings } from 'lucide-react';

export default () => {
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ churchName: '', district: '', assemblyName: '', description: '', phone: '', email: '', address: '', givingInstructions: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const data = res.data.data;
        setSettings(data);
        setFormData({
          churchName: data.churchName || '',
          district: data.district || '',
          assemblyName: data.assemblyName || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          givingInstructions: data.givingInstructions || '',
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', formData);
      setMessage('Settings updated successfully');
    } catch (error) {
      setMessage('Failed to update settings');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Church Settings</h1>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="text-church-secondary" size={20} />
              General Settings
            </CardTitle>
            <CardDescription>Manage your church information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="churchName">Church Name</Label>
                  <Input id="churchName" value={formData.churchName} onChange={(e) => setFormData({ ...formData, churchName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="assemblyName">Assembly Name</Label>
                <Input id="assemblyName" value={formData.assemblyName} onChange={(e) => setFormData({ ...formData, assemblyName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="givingInstructions">Giving Instructions</Label>
                <Textarea id="givingInstructions" value={formData.givingInstructions} onChange={(e) => setFormData({ ...formData, givingInstructions: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Update Settings</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
