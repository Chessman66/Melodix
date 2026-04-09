import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="w-full bg-black h-full flex-shrink-0 flex flex-col p-6 gap-8 border-r border-zinc-900 z-20 overflow-y-auto no-scrollbar pb-32">
      <div className="flex items-center gap-2 text-white font-bold text-xl">
        <Music2 className="text-green-500" size={32} />
        <span>Melodix</span>
      </div>

      <nav className="flex flex-col gap-4">
        <NavItem to="/" icon={<Home size={24} />} label="Home" />
        <NavItem to="/search" icon={<Search size={24} />} label="Search" />
        <NavItem to="/library" icon={<Library size={24} />} label="Your Library" />
      </nav>

      <div className="flex flex-col gap-4 mt-4">
        <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors font-medium min-w-0">
          <div className="bg-zinc-400 rounded-sm p-1 text-black flex-shrink-0">
            <PlusSquare size={20} />
          </div>
          <span className="truncate">Create Playlist</span>
        </button>
        <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors font-medium min-w-0">
          <div className="bg-gradient-to-br from-indigo-700 to-blue-300 rounded-sm p-1 text-white flex-shrink-0">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="truncate">Liked Songs</span>
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-900">
        {!isAuthenticated ? (
          <NavLink 
            to="/login" 
            className="block w-full py-3 bg-white text-black text-center font-bold rounded-full hover:scale-105 transition-transform"
          >
            Log in
          </NavLink>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-zinc-500 text-sm">
              Logged in as <span className="text-white font-bold">{user?.username}</span>
            </div>
            <button 
              onClick={logout}
              className="text-xs text-zinc-500 hover:text-white transition-colors text-left"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-4 transition-colors font-medium ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`
    }
  >
    {icon}
    <span className="truncate">{label}</span>
  </NavLink>
);
