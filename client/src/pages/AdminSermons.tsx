import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { Sermon } from '../types';
import { format } from 'date-fns';
import { Mic, Plus, Edit, Trash2 } from 'lucide-react';

export default () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [formData, setFormData] = useState({ title: '', speaker: '', date: '', scripture: '', description: '', category: '', audioUrl: '', videoUrl: '', isPublished: true });

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await api.get('/sermons');
        setSermons(res.data.data);
      } catch (error) {
        console.error('Failed to fetch sermons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/sermons/${editing._id}`, formData);
      } else {
        await api.post('/sermons', formData);
      }
      setFormData({ title: '', speaker: '', date: '', scripture: '', description: '', category: '', audioUrl: '', videoUrl: '', isPublished: true });
      setEditing(null);
      const res = await api.get('/sermons');
      setSermons(res.data.data);
    } catch (error) {
      console.error('Failed to save sermon:', error);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditing(sermon);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date.split('T')[0],
      scripture: sermon.scripture,
      description: sermon.description,
      category: sermon.category,
      audioUrl: sermon.audioUrl || '',
      videoUrl: sermon.videoUrl || '',
      isPublished: sermon.isPublished,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/sermons/${id}`);
      setSermons(sermons.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Failed to delete sermon:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Sermons Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{editing ? 'Edit Sermon' : 'All Sermons'}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
              ) : (
                <div className="space-y-3">
                  {sermons.map((sermon) => (
                    <div key={sermon._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{sermon.title}</h3>
                        <p className="text-sm text-gray-600">{sermon.speaker} - {format(new Date(sermon.date), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handleEdit(sermon)} className="text-church-primary hover:text-church-primary-light"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(sermon._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
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
              <CardTitle>{editing ? 'Edit Sermon' : 'Add Sermon'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="speaker">Speaker</Label>
                  <Input id="speaker" value={formData.speaker} onChange={(e) => setFormData({ ...formData, speaker: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="scripture">Scripture</Label>
                  <Input id="scripture" value={formData.scripture} onChange={(e) => setFormData({ ...formData, scripture: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Faith">Faith</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Family">Family</option>
                    <option value="Worship">Worship</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audioUrl">Audio URL</Label>
                  <Input id="audioUrl" value={formData.audioUrl} onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input id="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'} Sermon</Button>
                {editing && <Button type="button" variant="outline" className="w-full" onClick={() => { setEditing(null); setFormData({ title: '', speaker: '', date: '', scripture: '', description: '', category: '', audioUrl: '', videoUrl: '', isPublished: true }); }}>Cancel</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
