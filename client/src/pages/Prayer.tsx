import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';

export default () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    request: '',
    category: 'general',
    isAnonymous: false,
    preferredFollowUp: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/prayer-requests', formData);
      setMessage('Your prayer request has been submitted. Our prayer team will be praying for you.');
      setFormData({ subject: '', request: '', category: 'general', isAnonymous: false, preferredFollowUp: '' });
    } catch (error) {
      setMessage('Failed to submit prayer request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto mb-4 text-church-secondary" size={48} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Prayer Requests</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">We believe in the power of prayer. Share your prayer request with us and our team will stand with you in faith.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="general">General</option>
                <option value="healing">Healing</option>
                <option value="guidance">Guidance</option>
                <option value="family">Family</option>
                <option value="financial">Financial</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="request">Prayer Request</Label>
              <Textarea id="request" rows={5} value={formData.request} onChange={(e) => setFormData({ ...formData, request: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="followUp">Preferred Follow-up (optional)</Label>
              <Input id="followUp" value={formData.preferredFollowUp} onChange={(e) => setFormData({ ...formData, preferredFollowUp: e.target.value })} placeholder="Phone or email" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="anonymous" checked={formData.isAnonymous} onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
              <Label htmlFor="anonymous">Submit anonymously</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Prayer Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
