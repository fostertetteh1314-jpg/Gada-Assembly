import { Link } from 'react-router-dom';
import { ArrowRight, Users, Mic, Calendar, Heart, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Sermon, Event, Leader, ChurchSettings } from '../types';
import { format } from 'date-fns';

const Home = () => {
  const { user } = useAuth();
  const [latestSermons, setLatestSermons] = useState<Sermon[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sermonsRes, eventsRes, leadersRes, settingsRes] = await Promise.all([
          api.get('/sermons'),
          api.get('/events?upcoming=true'),
          api.get('/leaders'),
          api.get('/settings'),
        ]);
        setLatestSermons(sermonsRes.data.data.slice(0, 3));
        setUpcomingEvents(eventsRes.data.data.slice(0, 3));
        setLeaders(leadersRes.data.data);
        setSettings(settingsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative bg-church-primary text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Welcome to Gada Assembly</h1>
          <p className="text-xl md:text-2xl mb-4 text-church-secondary">{settings?.defaultScripture?.reference || 'Jeremiah 29:11'}</p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-200">"{settings?.defaultScripture?.text || 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.'}"</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto">Join Us This Sunday <ArrowRight className="ml-2" size={18} /></Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-church-primary">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src="/church-flyer.png" alt="Gada Assembly Flyer" className="w-full h-auto object-contain" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-church-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-church-primary" size={24} />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Join a vibrant community of believers growing together in faith and love.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Mic className="text-church-primary" size={24} />
                </div>
                <CardTitle>Worship</CardTitle>
                <CardDescription>Experience powerful worship and life-changing messages every Sunday.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-church-primary" size={24} />
                </div>
                <CardTitle>Serve</CardTitle>
                <CardDescription>Discover your purpose and serve in one of our many ministry departments.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Latest Sermons</h2>
            <p className="section-subtitle">Grow in your faith with our latest teachings</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestSermons.map((sermon) => (
                <Card key={sermon._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-50 flex items-center justify-center">
                      {sermon.thumbnail ? (
                        <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
                      ) : (
                        <Mic className="text-church-primary/30" size={48} />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-church-secondary font-medium mb-2">{sermon.category}</div>
                      <h3 className="font-serif text-xl font-semibold mb-2">{sermon.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{sermon.speaker} - {format(new Date(sermon.date), 'MMM d, yyyy')}</p>
                      <Link to={`/sermons/${sermon._id}`} className="text-church-primary hover:text-church-primary-light font-medium inline-flex items-center">
                        Listen Now <ChevronRight size={16} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/sermons">
              <Button variant="outline">View All Sermons</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-church-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Stay connected with what's happening in our community</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
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
                      <p className="text-sm text-gray-600 mb-2">{format(new Date(event.date), 'MMM d, yyyy')} at {event.startTime}</p>
                      <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                      <Link to={`/events/${event._id}`} className="text-church-primary hover:text-church-primary-light font-medium inline-flex items-center">
                        Learn More <ChevronRight size={16} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Leadership</h2>
            <p className="section-subtitle">Meet the dedicated servants leading our assembly</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {leaders.map((leader) => (
                <Card key={leader._id} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.position} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="text-church-primary/30" size={32} />
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold">{typeof leader.user === 'string' ? leader.user : (leader.user as any)?.firstName || ''} {(typeof leader.user === 'string' ? '' : (leader.user as any)?.lastName || '')}</h3>
                    <p className="text-church-secondary text-sm font-medium">{leader.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {!user && (
        <section className="py-16 bg-church-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">First Time Here?</h2>
            <p className="text-lg mb-8 text-gray-200">We would love to welcome you. Fill out our connect card and let us know you're coming!</p>
            <Link to="/new-here">
              <Button size="lg" variant="secondary">I'm New Here</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
