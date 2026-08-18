import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { PrayerRequest } from '../types';
import { format } from 'date-fns';
import { Heart, CheckCircle, XCircle } from 'lucide-react';

export default () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/prayer-requests');
        setRequests(res.data.data);
      } catch (error) {
        console.error('Failed to fetch prayer requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'being_prayed_for': return 'bg-yellow-100 text-yellow-800';
      case 'follow_up_required': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStatus = async (id: string, status: PrayerRequest['status']) => {
    try {
      await api.patch(`/prayer-requests/${id}/status`, { status });
      setRequests(requests.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Prayer Requests</h1>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-24 rounded" />)}</div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Heart className="text-church-primary" size={18} />
                      <h3 className="font-semibold">{request.subject}</h3>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.request}</p>
                  <p className="text-xs text-gray-500 mb-3">{format(new Date(request.createdAt), 'MMMM d, yyyy')}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(request._id, 'being_prayed_for')}><CheckCircle size={14} className="mr-1" /> Mark as Praying</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(request._id, 'resolved')}><XCircle size={14} className="mr-1" /> Resolve</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
