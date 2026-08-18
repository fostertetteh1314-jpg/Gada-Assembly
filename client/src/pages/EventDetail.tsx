import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../lib/api';
import { Event } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

export default () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', numberOfAttendees: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setMessage('');
    try {
      await api.post(`/events/${id}/register`, formData);
      setMessage('Registration successful! We look forward to seeing you.');
      setFormData({ name: '', email: '', phone: '', numberOfAttendees: 1 });
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/events" className="inline-flex items-center text-church-secondary hover:text-white mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{event.name}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            {event.banner ? (
              <img src={event.banner} alt={event.name} className="w-full h-full object-cover" />
            ) : (
              <Calendar className="text-church-primary/30" size={64} />
            )}
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} className="text-church-secondary" />
                <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-church-secondary" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-church-secondary" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>
            {event.registrationRequired && (
              <div className="border-t pt-6">
                <h3 className="font-serif text-2xl font-semibold mb-4">Register for this Event</h3>
                {message && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</div>}
                <form onSubmit={handleRegister} className="space-y-4 max-w-lg">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="numberOfAttendees">Number of Attendees</Label>
                    <Input id="numberOfAttendees" type="number" min="1" value={formData.numberOfAttendees} onChange={(e) => setFormData({ ...formData, numberOfAttendees: parseInt(e.target.value) })} required />
                  </div>
                  <Button type="submit" disabled={registering}>{registering ? 'Registering...' : 'Register Now'}</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
