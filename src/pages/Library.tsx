import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, Music, ListMusic } from 'lucide-react';
import { SongCard } from '../components/SongCard';

export const Library: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [playlists, setPlaylists] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/playlists', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setPlaylists(res.data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, token]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('audio', file);

    try {
      await axios.post('/api/songs', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowUpload(false);
      setTitle('');
      setArtist('');
      setFile(null);
      alert('Song uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music size={64} className="text-zinc-700 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Enjoy your Library</h2>
        <p className="text-zinc-400 mb-8">Log in to see your playlists and upload your own music.</p>
        <NavLink 
          to="/login"
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Log in
        </NavLink>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button 
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
        >
          <Upload size={20} />
          Upload Song
        </button>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ListMusic className="text-green-500" />
          <h2 className="text-2xl font-bold">Your Playlists</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist: any) => (
            <div key={playlist._id} className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800/60 transition-all cursor-pointer">
              <div className="aspect-square bg-zinc-800 rounded-md mb-4 flex items-center justify-center">
                <Music size={48} className="text-zinc-700" />
              </div>
              <h3 className="font-bold truncate">{playlist.name}</h3>
              <p className="text-zinc-400 text-sm">{playlist.songs.length} songs</p>
            </div>
          ))}
          {playlists.length === 0 && (
            <div className="col-span-full py-10 text-zinc-500">No playlists yet.</div>
          )}
        </div>
      </section>

      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Upload New Song</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Song Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800 border-none rounded-lg p-3 text-white outline-none"
                required
              />
              <input 
                type="text" 
                placeholder="Artist" 
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="bg-zinc-800 border-none rounded-lg p-3 text-white outline-none"
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-400">Audio File (MP3)</label>
                <input 
                  type="file" 
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-400 hover:file:bg-zinc-700"
                  required
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="flex-1 py-3 rounded-lg font-bold border border-zinc-800 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
