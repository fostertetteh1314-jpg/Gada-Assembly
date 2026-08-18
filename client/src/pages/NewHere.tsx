import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Calendar, MapPin, Heart } from 'lucide-react';

export default () => {
  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">New Here?</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">We are so glad you are considering joining us. Here is what you can expect when you visit.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-church-primary" size={24} />
              </div>
              <CardTitle>Sunday Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Join us every Sunday at 8:00 AM for worship, fellowship, and a powerful word from God.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-church-primary" size={24} />
              </div>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">We are located at Gada, Accra, Ghana. Ample parking is available for visitors.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Users className="text-church-primary" size={24} />
              </div>
              <CardTitle>Welcome Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Our friendly welcome team will greet you at the door and help you find your way around.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-church-primary" size={24} />
              </div>
              <CardTitle>Kids Ministry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Children are welcome! We have age-appropriate programs for kids of all ages during service.</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <h2 className="section-title mb-4">Take the Next Step</h2>
          <p className="section-subtitle mb-8">We would love to connect with you and help you get plugged into our community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/connect-card">
              <Button size="lg">Fill Out Connect Card</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg">View Upcoming Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
