import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Donation } from '../types';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

export default () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/giving');
        setDonations(res.data.data);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalAmount = donations.filter((d) => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Giving Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="text-church-secondary" size={20} />
              Total Giving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-church-primary">GHS {totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-church-primary">{donations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-church-primary">{donations.filter((d) => d.status === 'completed').length}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Member</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{donation.member}</td>
                      <td className="py-3 px-4 capitalize">{donation.category}</td>
                      <td className="py-3 px-4 font-medium">GHS {donation.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{donation.paymentMethod}</td>
                      <td className="py-3 px-4"><Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>{donation.status}</Badge></td>
                      <td className="py-3 px-4">{format(new Date(donation.createdAt), 'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
