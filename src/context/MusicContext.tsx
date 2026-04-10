import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl: string;
  duration: number;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  progress: number;
  seek: (percent: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  queue: Song[];
  addToQueue: (song: Song) => void;
  playNext: () => void;
  stopSong: () => void;
  likedSongs: string[];
  toggleLike: (songId: string) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      axios.get('/api/songs', { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          // We need a way to get the initial liked songs list. 
          // The server returns the user object with likedSongs IDs on login usually, 
          // but let's fetch it specifically if needed or assume we can get it from a new endpoint.
          // Actually, let's just fetch the IDs.
          axios.get('/api/me/liked-songs', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setLikedSongs(res.data.map((s: any) => s._id)))
            .catch(err => console.error('Failed to fetch liked songs', err));
        });
    } else {
      setLikedSongs([]);
    }
  }, [isAuthenticated, token]);

  const toggleLike = async (songId: string) => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await axios.post(`/api/songs/${songId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikedSongs(res.data.likedSongs);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying && howlRef.current) {
      interval = setInterval(() => {
        const seek = howlRef.current?.seek() || 0;
        const duration = howlRef.current?.duration() || 1;
        setProgress((seek / duration) * 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playSong = (song: Song) => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [song.audioUrl],
      html5: true,
      volume: volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        playNext();
      },
    });

    howlRef.current = howl;
    setCurrentSong(song);
    howl.play();
  };

  const stopSong = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue(prev => prev.slice(1));
      playSong(nextSong);
    }
  };

  const togglePlay = () => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  const seek = (percent: number) => {
    if (!howlRef.current) return;
    const duration = howlRef.current.duration();
    howlRef.current.seek((percent / 100) * duration);
    setProgress(percent);
  };

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  return (
    <MusicContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay, progress, seek, volume, setVolume, queue, addToQueue, playNext, stopSong, likedSongs, toggleLike }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
