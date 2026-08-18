import { ChurchSettings } from '../types';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { BookOpen, Users, Heart, Target } from 'lucide-react';

export default () => {
  const [settings, setSettings] = useState<ChurchSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm overflow-hidden">
            <img src="/church-logo.jpg" alt="Gada Assembly Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">Learn about our history, mission, and the vision that drives us forward.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="section-title mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Gada Assembly is part of The Church of Pentecost, Queen City District. Founded with a vision to reach the community with the gospel of Jesus Christ, we have grown into a vibrant family of believers committed to making disciples.
          </p>
          <p className="text-gray-700 leading-relaxed">
            From humble beginnings, we have seen God move in mighty ways - transforming lives, healing the brokenhearted, and restoring hope to many. Today, we continue to stand as a beacon of hope in the Gada community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-church-primary" size={24} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Mission</h3>
            <p className="text-sm text-gray-600">To reach the world with the gospel of Jesus Christ and build a community of passionate followers.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-church-primary" size={24} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Vision</h3>
            <p className="text-sm text-gray-600">To be a thriving assembly that impacts our community and raises leaders for tomorrow.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-church-primary" size={24} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Values</h3>
            <p className="text-sm text-gray-600">Love, Faith, Integrity, Service, and Excellence guide everything we do.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-church-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-church-primary" size={24} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Community</h3>
            <p className="text-sm text-gray-600">We believe in doing life together and supporting one another through every season.</p>
          </div>
        </div>
        <div className="bg-church-primary text-white rounded-lg p-8">
          <h3 className="font-serif text-2xl font-semibold mb-4">Service Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-church-secondary font-medium">Sunday Worship</p>
              <p className="text-gray-300">{settings?.serviceTimes?.Sunday || '8:00 AM'}</p>
            </div>
            <div>
              <p className="text-church-secondary font-medium">Wednesday Prayer</p>
              <p className="text-gray-300">{settings?.serviceTimes?.Wednesday || '6:00 PM'}</p>
            </div>
            <div>
              <p className="text-church-secondary font-medium">Friday Fasting</p>
              <p className="text-gray-300">{settings?.serviceTimes?.Friday || '6:00 AM'}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-church-secondary/30">
            <p className="text-gray-300">Location: {settings?.address || 'Gada, Accra, Ghana'}</p>
            <p className="text-gray-300">Phone: {settings?.phone || '+233 24 123 4567'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
