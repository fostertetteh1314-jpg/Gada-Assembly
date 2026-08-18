import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { Megaphone, Users } from 'lucide-react';

export default () => {
  const [formData, setFormData] = useState({ recipient: '', type: 'general', title: '', message: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notifications', formData);
      setMessage('Notification sent successfully');
      setFormData({ recipient: '', type: 'general', title: '', message: '' });
    } catch (error) {
      setMessage('Failed to send notification');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Send Notifications</h1>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="text-church-secondary" size={20} />
              Create Notification
            </CardTitle>
            <CardDescription>Send a notification to a specific user or all users</CardDescription>
          </CardHeader>
          <CardContent>
            {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="recipient">Recipient User ID (leave empty for all)</Label>
                <Input id="recipient" value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="general">General</option>
                  <option value="event">Event</option>
                  <option value="prayer">Prayer</option>
                  <option value="announcement">Announcement</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Send Notification</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
