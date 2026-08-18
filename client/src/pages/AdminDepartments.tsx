import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { Department } from '../types';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

export default () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      setFormData({ name: '', description: '' });
      setEditing(null);
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-6">Departments Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Departments</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-16 rounded" />)}</div>
              ) : (
                <div className="space-y-3">
                  {departments.map((department) => (
                    <div key={department._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{department.name}</h3>
                        <p className="text-sm text-gray-600">{department.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{department.members.length} members</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(department); setFormData({ name: department.name, description: department.description || '' }); }} className="text-church-primary hover:text-church-primary-light"><Edit size={16} /></button>
                        <button onClick={async () => { await api.delete(`/departments/${department._id}`); setDepartments(departments.filter((d) => d._id !== department._id)); }} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
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
              <CardTitle>{editing ? 'Edit Department' : 'Add Department'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'} Department</Button>
                {editing && <Button type="button" variant="outline" className="w-full" onClick={() => { setEditing(null); setFormData({ name: '', description: '' }); }}>Cancel</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
