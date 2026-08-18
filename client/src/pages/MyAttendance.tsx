import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../lib/api';
import { AttendanceSession, AttendanceRecord } from '../types';
import { format } from 'date-fns';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export default () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, recordsRes] = await Promise.all([api.get('/attendance/sessions'), api.get('/attendance/sessions')]);
        setSessions(sessionsRes.data.data);
        setRecords(recordsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const presentCount = records.filter((r) => r.status === 'present').length;
  const totalCount = records.length;

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Attendance</h1>
          <p className="text-gray-200">Track your attendance history</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{presentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="text-red-600" size={20} />
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{totalCount - presentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-primary">{sessions.length}</p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="font-serif text-xl font-semibold mb-4">Attendance Sessions</h2>
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-church-secondary" size={20} />
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-sm text-gray-600">{format(new Date(session.date), 'MMMM d, yyyy')} - {session.eventType}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Session</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
