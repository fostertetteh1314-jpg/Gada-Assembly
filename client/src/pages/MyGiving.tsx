import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../lib/api';
import { Donation } from '../types';
import { DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/giving');
        const data = res.data.data;
        setDonations(data);
        setTotal(data.reduce((sum: number, d: Donation) => d.status === 'completed' ? sum + d.amount : sum, 0));
      } catch (error) {
        console.error('Failed to fetch giving:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Giving</h1>
          <p className="text-gray-200">Track your contributions to the work of the ministry</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="text-church-secondary" size={20} />
                Total Giving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-primary">GHS {total.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-primary">{donations.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-primary">{donations.length > 0 ? format(new Date(donations[0].createdAt), 'MMM d') : 'N/A'}</p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="font-serif text-xl font-semibold mb-4">Giving History</h2>
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{donation.category}</p>
                      <p className="text-sm text-gray-600">{format(new Date(donation.createdAt), 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-church-primary">GHS {donation.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 capitalize">{donation.status}</p>
                    </div>
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
