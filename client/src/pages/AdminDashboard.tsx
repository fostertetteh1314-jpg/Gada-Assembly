import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { Users, Mic, Calendar, Heart, DollarSign, CheckCircle } from 'lucide-react';

export default () => {
  const [stats, setStats] = useState({ members: 0, sermons: 0, events: 0, giving: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, sermonsRes, eventsRes, givingRes] = await Promise.all([
          api.get('/reports/membership'),
          api.get('/sermons'),
          api.get('/reports/events'),
          api.get('/reports/giving'),
        ]);
        setStats({
          members: membersRes.data.data.total || 0,
          sermons: sermonsRes.data.data.length || 0,
          events: eventsRes.data.data.total || 0,
          giving: givingRes.data.data.totalAmount || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Members', value: stats.members, icon: Users, color: 'bg-church-primary', link: '/admin/members' },
    { title: 'Sermons', value: stats.sermons, icon: Mic, color: 'bg-church-secondary', link: '/admin/sermons' },
    { title: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'bg-church-primary', link: '/admin/events' },
    { title: 'Total Giving (GHS)', value: `GHS ${stats.giving.toFixed(2)}`, icon: DollarSign, color: 'bg-church-secondary', link: '/admin/giving' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif font-bold text-church-primary mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                     <p className="text-2xl font-bold text-church-text">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/admin/sermons"><Button variant="outline" className="w-full justify-start">Add New Sermon</Button></Link>
              <Link to="/admin/events"><Button variant="outline" className="w-full justify-start">Create Event</Button></Link>
              <Link to="/admin/announcements"><Button variant="outline" className="w-full justify-start">Post Announcement</Button></Link>
              <Link to="/admin/settings"><Button variant="outline" className="w-full justify-start">Update Settings</Button></Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-church-secondary rounded-full" />
                <p className="text-sm text-gray-600">New member registered today</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-church-primary rounded-full" />
                <p className="text-sm text-gray-600">Sunday service attendance recorded</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-church-secondary rounded-full" />
                <p className="text-sm text-gray-600">New sermon uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
