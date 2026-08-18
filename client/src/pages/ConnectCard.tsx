import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { Heart } from 'lucide-react';

export default () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    prayerRequest: '',
    interests: [] as string[],
    howDidYouHear: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Thank you for filling out our connect card! We are excited to have you as part of our community.');
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', prayerRequest: '', interests: [], howDidYouHear: '' });
  };

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter((i) => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto mb-4 text-church-secondary" size={48} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Connect Card</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">We would love to get to know you better. Fill out this card and let us know how we can connect with you.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div>
              <Label>Areas of Interest</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Children Ministry', 'Youth Ministry', 'Music Ministry', 'Ushering', 'Media', 'Prayer Team', 'Outreach', 'Evangelism'].map((interest) => (
                  <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-3 py-1 rounded-full text-sm border ${formData.interests.includes(interest) ? 'bg-church-primary text-white border-church-primary' : 'border-gray-300 text-gray-700 hover:border-church-primary'}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
              <Select value={formData.howDidYouHear} onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}>
                <option value="">Select</option>
                <option value="friend">Friend or Family</option>
                <option value="social">Social Media</option>
                <option value="website">Website</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="prayerRequest">Prayer Request (optional)</Label>
              <Textarea id="prayerRequest" rows={3} value={formData.prayerRequest} onChange={(e) => setFormData({ ...formData, prayerRequest: e.target.value })} />
            </div>
            <Button type="submit" className="w-full">Submit Connect Card</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
