import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { api } from '../lib/api';
import { ChurchSettings } from '../types';
import { Users, Calendar, DollarSign } from 'lucide-react';

export default () => {
  const [membership, setMembership] = useState<any>(null);
  const [giving, setGiving] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [membershipRes, givingRes] = await Promise.all([
          api.get('/reports/membership'),
          api.get('/reports/giving'),
        ]);
        setMembership(membershipRes.data.data);
        setGiving(givingRes.data.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-church-secondary" size={20} />
              Membership Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-church-primary">{membership?.total || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{membership?.active || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-yellow-600">{membership?.inactive || 0}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Visitors</p>
                    <p className="text-2xl font-bold text-blue-600">{membership?.visitors || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="text-church-secondary" size={20} />
              Giving Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Giving</p>
                  <p className="text-2xl font-bold text-church-primary">GHS {giving?.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="space-y-2">
                  {giving?.byCategory?.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium capitalize">{item._id}</span>
                      <span className="text-church-primary font-semibold">GHS {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
