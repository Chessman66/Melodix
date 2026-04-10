import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { SongCard } from '../components/SongCard';
import { Heart, Play } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const LikedSongs: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const { playSong, addToQueue } = useMusic();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      axios.get('/api/me/liked-songs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setSongs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
      songs.slice(1).forEach((song: any) => addToQueue(song));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Heart size={64} className="text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
        <p className="text-zinc-500 mb-6">Log in to see your favorite tracks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end gap-6 bg-gradient-to-b from-green-900/40 to-transparent -mt-8 -mx-8 p-8 pt-20">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-700 to-blue-300 rounded-lg shadow-2xl flex items-center justify-center text-white">
          <Heart size={80} fill="currentColor" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2">Playlist</p>
          <h1 className="text-7xl font-black text-white mb-6">Liked Songs</h1>
          <div className="flex items-center gap-2 text-zinc-300 font-medium">
            <span className="text-white">You</span>
            <span className="w-1 h-1 bg-zinc-500 rounded-full" />
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          <Play fill="black" className="text-black ml-1" size={24} />
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500">Loading your favorites...</div>
      ) : songs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {songs.map((song: any) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-lg">You haven't liked any songs yet.</p>
          <p className="text-sm">Tap the heart icon on any track to save it here.</p>
        </div>
      )}
    </div>
  );
};
