import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Plus, ListPlus, Heart } from 'lucide-react';

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export const SongCard: React.FC<{ song: Song }> = ({ song }) => {
  const { playSong, currentSong, isPlaying, addToQueue, likedSongs, toggleLike } = useMusic();
  const isCurrent = currentSong?._id === song._id;
  const isLiked = likedSongs.includes(song._id);

  return (
    <div 
      className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/80 transition-all group cursor-pointer border border-transparent hover:border-zinc-700/50 relative"
    >
      <div className="relative aspect-square mb-4 shadow-2xl overflow-hidden rounded-lg">
        <img 
          src={song.thumbnailUrl} 
          alt={song.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); addToQueue(song); }}
            className="w-10 h-10 bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
            title="Add to queue"
          >
            <ListPlus size={18} className="text-white" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); playSong(song); }}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            <Play fill="black" className="text-black ml-1" size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800/80 text-white hover:bg-zinc-700'}`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className={`font-bold truncate text-base ${isCurrent ? 'text-green-500' : 'text-white'}`}>{song.title}</h3>
        <p className="text-zinc-400 text-xs font-medium truncate uppercase tracking-wider">{song.artist}</p>
      </div>
    </div>
  );
};
