import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, X } from 'lucide-react';
import { motion } from 'motion/react';

export const Player: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, progress, seek, volume, setVolume, queue, stopSong } = useMusic();

  if (!currentSong) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-2 md:p-4 flex items-center justify-between z-[100]"
    >
      {/* Close Button */}
      <button 
        onClick={stopSong}
        className="absolute -top-10 right-4 bg-zinc-900/80 p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        title="Close Player"
      >
        <X size={16} />
      </button>

      {/* Song Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/3 min-w-0">
        <img 
          src={currentSong.thumbnailUrl} 
          alt={currentSong.title} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover flex-shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <h4 className="text-white text-sm md:text-base font-medium truncate">{currentSong.title}</h4>
          <p className="text-zinc-400 text-xs md:text-sm truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1 md:gap-2 flex-1 md:w-1/3">
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-full max-w-md hidden md:flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 w-8 text-right">
            {formatTime((progress / 100) * (currentSong.duration || 0))}
          </span>
          <div 
            className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              seek((x / rect.width) * 100);
            }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-green-500 transition-colors"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 w-8">
            {formatTime(currentSong.duration)}
          </span>
        </div>
      </div>

      {/* Volume & Queue */}
      <div className="flex items-center justify-end gap-2 md:gap-4 w-1/4 md:w-1/3 min-w-0">
        <div className="flex items-center gap-1 md:gap-2 text-zinc-500 md:mr-2 flex-shrink-0">
          <ListMusic size={18} />
          <span className="text-[10px] md:text-xs font-bold">{queue.length}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="flex-shrink-0">
            {volume === 0 ? <VolumeX size={18} className="text-zinc-400" /> : <Volume2 size={18} className="text-zinc-400" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 lg:w-24 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white hidden lg:block"
          />
        </div>
      </div>
    </motion.div>
  );
};

function formatTime(seconds: number) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
