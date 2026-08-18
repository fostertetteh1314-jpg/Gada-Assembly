import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { api } from '../lib/api';
import { Sermon } from '../types';
import { format } from 'date-fns';
import { Search, Mic, Filter } from 'lucide-react';

export default () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await api.get(`/sermons${category ? `?category=${category}` : ''}`);
        setSermons(res.data.data);
      } catch (error) {
        console.error('Failed to fetch sermons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [category]);

  const filtered = sermons.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Sermons</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">Listen to powerful messages that will strengthen your faith and transform your life.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search sermons..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Faith">Faith</option>
              <option value="Prayer">Prayer</option>
              <option value="Family">Family</option>
              <option value="Worship">Worship</option>
              <option value="Salvation">Salvation</option>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />)}</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((sermon) => (
              <Link key={sermon._id} to={`/sermons/${sermon._id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                    {sermon.thumbnail ? (
                      <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <Mic className="text-church-primary/30" size={32} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-church-secondary font-medium mb-1">{sermon.category}</div>
                    <h3 className="font-serif text-xl font-semibold mb-2">{sermon.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{sermon.speaker} - {format(new Date(sermon.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{sermon.description}</p>
                    <div className="flex gap-2 mt-3">
                      {sermon.tags?.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-50 text-church-primary px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
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
