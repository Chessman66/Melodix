import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SongCard } from '../components/SongCard';
import { Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';

// High-quality mock data for a vibrant initial look
const MOCK_CATEGORIES = [
  {
    title: "Trending Now",
    songs: [
      { _id: 'm1', title: 'Midnight City', artist: 'M83', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', thumbnailUrl: 'https://picsum.photos/seed/m83/400/400', duration: 243 },
      { _id: 'm2', title: 'Starboy', artist: 'The Weeknd', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', thumbnailUrl: 'https://picsum.photos/seed/weeknd/400/400', duration: 230 },
      { _id: 'm3', title: 'Blinding Lights', artist: 'The Weeknd', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', thumbnailUrl: 'https://picsum.photos/seed/lights/400/400', duration: 200 },
      { _id: 'm4', title: 'Levitating', artist: 'Dua Lipa', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', thumbnailUrl: 'https://picsum.photos/seed/dua/400/400', duration: 203 },
      { _id: 'm5', title: 'Save Your Tears', artist: 'The Weeknd', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', thumbnailUrl: 'https://picsum.photos/seed/tears/400/400', duration: 215 },
      { _id: 'm6', title: 'Peaches', artist: 'Justin Bieber', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', thumbnailUrl: 'https://picsum.photos/seed/peaches/400/400', duration: 198 },
    ]
  },
  {
    title: "Chill Vibes",
    songs: [
      { _id: 'c1', title: 'Weightless', artist: 'Marconi Union', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', thumbnailUrl: 'https://picsum.photos/seed/chill1/400/400', duration: 480 },
      { _id: 'c2', title: 'Lofi Study', artist: 'Lofi Girl', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', thumbnailUrl: 'https://picsum.photos/seed/lofi/400/400', duration: 180 },
      { _id: 'c3', title: 'Sunset Lover', artist: 'Petit Biscuit', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', thumbnailUrl: 'https://picsum.photos/seed/sunset/400/400', duration: 237 },
      { _id: 'c4', title: 'Ocean Eyes', artist: 'Billie Eilish', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', thumbnailUrl: 'https://picsum.photos/seed/billie/400/400', duration: 200 },
    ]
  },
  {
    title: "Electronic Essentials",
    songs: [
      { _id: 'e1', title: 'One More Time', artist: 'Daft Punk', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', thumbnailUrl: 'https://picsum.photos/seed/daft/400/400', duration: 320 },
      { _id: 'e2', title: 'Strobe', artist: 'deadmau5', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', thumbnailUrl: 'https://picsum.photos/seed/mau5/400/400', duration: 637 },
      { _id: 'e3', title: 'Levels', artist: 'Avicii', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', thumbnailUrl: 'https://picsum.photos/seed/avicii/400/400', duration: 199 },
    ]
  }
];

export const Home: React.FC = () => {
  const [dbSongs, setDbSongs] = useState([]);
  const { playSong } = useMusic();

  useEffect(() => {
    axios.get('/api/songs')
      .then(res => setDbSongs(res.data))
      .catch(err => console.error(err));
  }, []);

  const heroSong = MOCK_CATEGORIES[0].songs[0];

  return (
    <div className="-mt-8 -mx-8">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroSong.thumbnailUrl} 
            alt="Hero" 
            className="w-full h-full object-cover scale-110 blur-sm brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-green-500 font-bold uppercase tracking-widest text-sm mb-4 block">Featured Track</span>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              {heroSong.title}
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
              Experience the latest masterpiece from {heroSong.artist}. Immerse yourself in the soundscapes of Melodix.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => playSong(heroSong)}
                className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
              >
                <Play fill="black" size={24} />
                Play Now
              </button>
              <button className="bg-zinc-500/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-zinc-500/40 transition-colors border border-zinc-700/50">
                <Info size={24} />
                More Info
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Rows */}
      <div className="px-8 pb-20 space-y-12 -mt-20 relative z-10">
        {/* User Uploads Row (if any) */}
        {dbSongs.length > 0 && (
          <SongRow title="Your Uploads" songs={dbSongs} />
        )}

        {/* Mock Rows */}
        {MOCK_CATEGORIES.map((cat, idx) => (
          <SongRow key={idx} title={cat.title} songs={cat.songs} />
        ))}
      </div>
    </div>
  );
};

const SongRow: React.FC<{ title: string; songs: any[] }> = ({ title, songs }) => {
  const { playSong, addToQueue } = useMusic();

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
      songs.slice(1).forEach(song => addToQueue(song));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between group cursor-pointer">
        <h2 className="text-2xl font-bold text-white group-hover:text-green-500 transition-colors flex items-center gap-2">
          {title}
          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
        </h2>
        <button 
          onClick={handlePlayAll}
          className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          Play All
        </button>
      </div>
      
      <div className="relative group/row">
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x no-scrollbar">
          {songs.map((song) => (
            <div key={song._id} className="min-w-[220px] md:min-w-[260px] snap-start">
              <SongCard song={song} />
            </div>
          ))}
        </div>
        
        {/* Scroll Buttons (Visual only for now) */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-black/60 rounded-full items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex hover:bg-black">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-black/60 rounded-full items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex hover:bg-black">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};
