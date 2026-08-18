import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Calendar } from 'lucide-react';
import { api } from '../lib/api';
import { Event } from '../types';
import { format } from 'date-fns';

export default () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Events</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">Join us for upcoming events and be part of our vibrant community.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event._id} to={`/events/${event._id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 bg-gray-50 flex items-center justify-center">
                    {event.banner ? (
                      <img src={event.banner} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="text-church-primary/30" size={48} />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-church-secondary font-medium mb-2">{event.category}</div>
                    <h3 className="font-serif text-xl font-semibold mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{format(new Date(event.date), 'MMMM d, yyyy')} at {event.startTime}</p>
                    <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
