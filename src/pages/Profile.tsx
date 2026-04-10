import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Camera, Save, X, Edit2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, token, updateUser, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.put('/api/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <User size={64} className="text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 overflow-hidden shadow-2xl"
      >
        {/* Header/Cover */}
        <div className="h-48 bg-gradient-to-r from-green-600/20 to-indigo-600/20 relative">
          <div className="absolute -bottom-16 left-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-2xl">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <User size={48} />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="text-4xl font-black bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <h1 className="text-4xl font-black text-white">{user?.username}</h1>
              )}
              <p className="text-zinc-500 mt-1">{user?.email}</p>
            </div>
            
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                isEditing 
                ? 'bg-green-500 text-black hover:scale-105' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Bio</label>
              {isEditing ? (
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 min-h-[120px] outline-none focus:border-green-500 transition-colors text-zinc-200"
                />
              ) : (
                <p className="text-zinc-300 leading-relaxed italic">
                  {user?.bio || "No bio yet. Click edit to add one!"}
                </p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Avatar URL</label>
                <input 
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 outline-none focus:border-green-500 transition-colors text-zinc-200"
                />
              </div>
            )}

            <div className="pt-8 border-t border-zinc-800/50 flex gap-12">
              <div>
                <p className="text-2xl font-black text-white">0</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Playlists</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">0</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">0</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Following</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
