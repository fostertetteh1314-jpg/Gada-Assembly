import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { api } from '../lib/api';
import { Mail, Phone, MapPin } from 'lucide-react';

export default () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Thank you for reaching out. We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">We would love to hear from you. Reach out to us with any questions or prayer requests.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-church-primary text-white rounded-lg shadow-lg p-8 h-full">
              <h3 className="font-serif text-2xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-church-secondary mt-1" size={18} />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-300">Gada, Accra, Ghana</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-church-secondary mt-1" size={18} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-300">+233 24 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-church-secondary mt-1" size={18} />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-300">info@gadaassembly.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
