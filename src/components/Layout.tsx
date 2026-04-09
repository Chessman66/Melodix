import React from 'react';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { useMusic } from '../context/MusicContext';
import { ListMusic, Music } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { queue, currentSong } = useMusic();

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      <div className="atmosphere" />
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-y-auto pb-24 scroll-smooth">
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Right Sidebar - Queue */}
      <aside className="w-80 bg-black/40 backdrop-blur-xl border-l border-zinc-900 hidden xl:flex flex-col p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-zinc-400">
          <ListMusic size={20} />
          <h2 className="font-bold uppercase tracking-widest text-sm">Next in Queue</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {queue.length > 0 ? (
            queue.map((song, idx) => (
              <div key={`${song._id}-${idx}`} className="flex items-center gap-3 group">
                <img src={song.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{song.title}</h4>
                  <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center gap-4">
              <Music size={48} strokeWidth={1} />
              <p className="text-sm">Your queue is empty.<br/>Add some songs to keep the vibe going!</p>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="mt-6 pt-6 border-t border-zinc-900">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Now Playing</p>
            <div className="flex items-center gap-3">
              <img src={currentSong.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover shadow-lg" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-green-500 truncate">{currentSong.title}</h4>
                <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <Player />
    </div>
  );
};
