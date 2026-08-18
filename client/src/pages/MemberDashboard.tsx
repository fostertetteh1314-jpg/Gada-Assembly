import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { Sermon, Event, Announcement, MemberProfile } from '../types';
import { format } from 'date-fns';
import { Mic, Calendar, Megaphone, Users, ChevronRight } from 'lucide-react';

export default () => {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, sermonsRes, eventsRes, announcementsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/sermons'),
          api.get('/events?upcoming=true'),
          api.get('/announcements'),
        ]);
        setProfile(profileRes.data.data.profile);
        setSermons(sermonsRes.data.data.slice(0, 2));
        setEvents(eventsRes.data.data.slice(0, 3));
        setAnnouncements(announcementsRes.data.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Welcome</h1>
          <p className="text-gray-200">Here is what is happening in your Gada Assembly community.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Next Service</CardTitle>
              <Calendar className="text-church-secondary" size={20} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-church-primary">Sunday 8:00 AM</p>
              <p className="text-sm text-gray-600">Join us for worship and fellowship</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Department</CardTitle>
              <Users className="text-church-secondary" size={20} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-church-primary">Youth Ministry</p>
              <p className="text-sm text-gray-600">Active member</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Membership</CardTitle>
              <Users className="text-church-secondary" size={20} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-church-primary capitalize">{profile?.membershipStatus || 'Active'}</p>
              <p className="text-sm text-gray-600">Member since {profile?.dateJoined ? format(new Date(profile.dateJoined), 'MMMM yyyy') : 'N/A'}</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-2xl">Latest Sermons</h2>
              <Link to="/sermons" className="text-church-primary hover:underline text-sm inline-flex items-center">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {sermons.map((sermon) => (
                <Card key={sermon._id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mic className="text-church-primary" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{sermon.title}</h3>
                      <p className="text-sm text-gray-600">{sermon.speaker} - {format(new Date(sermon.date), 'MMM d, yyyy')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-2xl">Upcoming Events</h2>
              <Link to="/events" className="text-church-primary hover:underline text-sm inline-flex items-center">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-church-primary" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{event.name}</h3>
                      <p className="text-sm text-gray-600">{format(new Date(event.date), 'MMM d, yyyy')} - {event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="section-title text-2xl mb-4">Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement._id}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-church-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone className="text-church-primary" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
