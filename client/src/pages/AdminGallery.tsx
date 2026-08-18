import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../lib/api';
import { GalleryAlbum } from '../types';
import { format } from 'date-fns';
import { FolderOpen, Plus } from 'lucide-react';

export default () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', coverImage: '' });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/gallery');
        setAlbums(res.data.data);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/gallery', formData);
      setFormData({ title: '', description: '', coverImage: '' });
      setShowForm(false);
      const res = await api.get('/gallery');
      setAlbums(res.data.data);
    } catch (error) {
      console.error('Failed to create album:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold text-church-primary">Gallery Management</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" /> New Album</Button>
      </div>
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Album</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Album Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Create Album</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />)
        ) : (
          albums.map((album) => (
            <Card key={album._id} className="overflow-hidden">
              <div className="h-48 bg-gray-50">
                {album.coverImage && <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />}
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif font-semibold text-lg">{album.title}</h3>
                <p className="text-sm text-gray-600">{album.description}</p>
                <p className="text-xs text-gray-500 mt-2">{format(new Date(album.createdAt), 'MMM d, yyyy')}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
