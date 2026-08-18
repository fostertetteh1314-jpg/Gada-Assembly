import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Announcement } from '../types';
import { format } from 'date-fns';
import { Megaphone, Plus, Edit, Trash2 } from 'lucide-react';

export default () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: '', priority: 'medium', expiresAt: '', isActive: true });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        setAnnouncements(res.data.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/announcements/${editing._id}`, formData);
      } else {
        await api.post('/announcements', formData);
      }
      setFormData({ title: '', content: '', image: '', priority: 'medium', expiresAt: '', isActive: true });
      setEditing(null);
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data);
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Announcements Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{announcement.content}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => { setEditing(announcement); setFormData({ title: announcement.title, content: announcement.content, image: announcement.image || '', priority: announcement.priority, expiresAt: announcement.expiresAt?.split('T')[0] || '', isActive: announcement.isActive }); }} className="text-church-primary hover:text-church-primary-light"><Edit size={16} /></button>
                        <button onClick={async () => { await api.delete(`/announcements/${announcement._id}`); setAnnouncements(announcements.filter((a) => a._id !== announcement._id)); }} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{editing ? 'Edit Announcement' : 'Add Announcement'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'} Announcement</Button>
                {editing && <Button type="button" variant="outline" className="w-full" onClick={() => { setEditing(null); setFormData({ title: '', content: '', image: '', priority: 'medium', expiresAt: '', isActive: true }); }}>Cancel</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
