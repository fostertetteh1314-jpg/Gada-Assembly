import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { User } from '../types';
import { Search, UserPlus, Trash2 } from 'lucide-react';

export default () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/members');
        setMembers(res.data.data.map((m: any) => m.user || m));
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filtered = members.filter((m) => m.firstName?.toLowerCase().includes(search.toLowerCase()) || m.lastName?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold text-church-primary">Members Management</h1>
        <Button><UserPlus size={16} className="mr-2" /> Add Member</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member) => (
                    <tr key={member._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{member.firstName} {member.lastName}</td>
                      <td className="py-3 px-4 text-gray-600">{member.email}</td>
                      <td className="py-3 px-4 capitalize">{member.role}</td>
                      <td className="py-3 px-4">
                        <Badge variant={member.isActive ? 'default' : 'secondary'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                      </td>
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
