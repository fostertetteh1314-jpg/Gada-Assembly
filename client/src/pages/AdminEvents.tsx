import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Event } from '../types';
import { format } from 'date-fns';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';

export default () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', date: '', startTime: '', endTime: '', location: '', category: '', registrationRequired: false, isPublished: true });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/events/${editing._id}`, formData);
      } else {
        await api.post('/events', formData);
      }
      setFormData({ name: '', description: '', date: '', startTime: '', endTime: '', location: '', category: '', registrationRequired: false, isPublished: true });
      setEditing(null);
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Events Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{event.name}</h3>
                        <p className="text-sm text-gray-600">{format(new Date(event.date), 'MMM d, yyyy')} - {event.location}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => { setEditing(event); setFormData({ name: event.name, description: event.description, date: event.date.split('T')[0], startTime: event.startTime, endTime: event.endTime, location: event.location, category: event.category, registrationRequired: event.registrationRequired, isPublished: event.isPublished }); }} className="text-church-primary hover:text-church-primary-light"><Edit size={16} /></button>
                        <button onClick={async () => { await api.delete(`/events/${event._id}`); setEvents(events.filter((e) => e._id !== event._id)); }} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
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
              <CardTitle>{editing ? 'Edit Event' : 'Add Event'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Worship">Worship</option>
                    <option value="Conference">Conference</option>
                    <option value="Prayer">Prayer</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="registrationRequired" checked={formData.registrationRequired} onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })} />
                  <Label htmlFor="registrationRequired">Registration Required</Label>
                </div>
                <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'} Event</Button>
                {editing && <Button type="button" variant="outline" className="w-full" onClick={() => { setEditing(null); setFormData({ name: '', description: '', date: '', startTime: '', endTime: '', location: '', category: '', registrationRequired: false, isPublished: true }); }}>Cancel</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
