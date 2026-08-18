import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Testimony } from '../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

export default () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const res = await api.get('/testimonies');
        setTestimonies(res.data.data);
      } catch (error) {
        console.error('Failed to fetch testimonies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonies();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const approve = async (id: string) => {
    try {
      await api.patch(`/testimonies/${id}/approve`);
      setTestimonies(testimonies.map((t) => (t._id === id ? { ...t, status: 'approved' } : t)));
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const reject = async (id: string) => {
    try {
      await api.patch(`/testimonies/${id}/reject`);
      setTestimonies(testimonies.map((t) => (t._id === id ? { ...t, status: 'rejected' } : t)));
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Testimonies</h1>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-24 rounded" />)}</div>
          ) : (
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <div key={testimony._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{testimony.title}</h3>
                    <Badge className={getStatusColor(testimony.status)}>{testimony.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testimony.testimony}</p>
                  <p className="text-xs text-gray-500 mb-3">{format(new Date(testimony.createdAt), 'MMMM d, yyyy')}</p>
                  {testimony.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approve(testimony._id)}><CheckCircle size={14} className="mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => reject(testimony._id)}><XCircle size={14} className="mr-1" /> Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
