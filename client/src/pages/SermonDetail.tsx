import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { Sermon } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, Mic, Play } from 'lucide-react';

export default () => {
  const { id } = useParams();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const res = await api.get(`/sermons/${id}`);
        setSermon(res.data.data);
      } catch (error) {
        console.error('Failed to fetch sermon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!sermon) return <div className="min-h-screen flex items-center justify-center">Sermon not found</div>;

  return (
    <div className="min-h-screen bg-church-background">
      <div className="bg-church-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/sermons" className="inline-flex items-center text-church-secondary hover:text-white mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Sermons
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{sermon.title}</h1>
          <p className="text-lg text-gray-200">{sermon.speaker} - {format(new Date(sermon.date), 'MMMM d, yyyy')}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 md:h-96 bg-gray-50 flex items-center justify-center">
            {sermon.thumbnail ? (
              <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
            ) : (
              <Mic className="text-church-primary/30" size={64} />
            )}
          </div>
          <div className="p-8">
            <div className="flex gap-2 mb-4">
              <span className="bg-church-secondary/20 text-church-primary px-3 py-1 rounded-full text-sm font-medium">{sermon.category}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{sermon.scripture}</span>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{sermon.description}</p>
            {sermon.tags && sermon.tags.length > 0 && (
              <div className="flex gap-2 mb-6">
                {sermon.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-50 text-church-primary px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
            {sermon.audioUrl && (
              <div className="border-t pt-6">
                <h3 className="font-serif text-xl font-semibold mb-4">Listen to this sermon</h3>
                <audio controls className="w-full">
                  <source src={sermon.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {sermon.videoUrl && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-serif text-xl font-semibold mb-4">Watch this sermon</h3>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-2">
                    <Play size={32} /> Watch Video
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
