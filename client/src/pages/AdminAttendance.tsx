import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { AttendanceSession } from '../types';
import { format } from 'date-fns';
import { ClipboardList, Plus } from 'lucide-react';

export default () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', date: '', eventType: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/attendance/sessions');
        setSessions(res.data.data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/attendance/sessions', formData);
      setFormData({ name: '', date: '', eventType: '' });
      setShowForm(false);
      const res = await api.get('/attendance/sessions');
      setSessions(res.data.data);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold text-church-primary">Attendance Management</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" /> New Session</Button>
      </div>
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Attendance Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="name">Session Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Sunday Service">Sunday Service</option>
                  <option value="Wednesday Prayer">Wednesday Prayer</option>
                  <option value="Friday Fasting">Friday Fasting</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">Create</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="text-church-secondary" size={20} />
            Attendance Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{session.name}</h3>
                    <p className="text-sm text-gray-600">{format(new Date(session.date), 'MMMM d, yyyy')} - {session.eventType}</p>
                  </div>
                  <Badge variant={session.isActive ? 'default' : 'secondary'}>{session.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
