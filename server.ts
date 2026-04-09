import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Data Fallback (In-memory for this environment)
let users: any[] = [];
let songs: any[] = [];
let playlists: any[] = [];

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
let isMongoConnected = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      isMongoConnected = true;
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI found. Using local in-memory storage.');
}

// Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  audioUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: 'https://picsum.photos/seed/music/400/400' },
  duration: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongoConnected) {
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
    } else {
      const user = { _id: Date.now().toString(), username, email, password: hashedPassword };
      users.push(user);
    }
    res.status(201).json({ message: 'User created' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    if (isMongoConnected) {
      user = await User.findOne({ email });
    } else {
      user = users.find(u => u.email === email);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Song Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/songs', authenticateToken, upload.single('audio'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    const { title, artist, duration } = req.body;
    const songData = {
      title,
      artist,
      audioUrl: `/uploads/${req.file.filename}`,
      duration: parseInt(duration) || 0,
      uploadedBy: req.user.id
    };

    let song;
    if (isMongoConnected) {
      song = new Song(songData);
      await song.save();
    } else {
      song = { _id: Date.now().toString(), ...songData, createdAt: new Date() };
      songs.push(song);
    }
    res.status(201).json(song);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/songs', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbSongs = await Song.find().sort({ createdAt: -1 });
      res.json(dbSongs);
    } else {
      res.json([...songs].sort((a, b) => b.createdAt - a.createdAt));
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/songs/search', async (req, res) => {
  try {
    const { q } = req.query;
    const queryStr = (q as string).toLowerCase();

    if (isMongoConnected) {
      const dbSongs = await Song.find({
        $or: [
          { title: { $regex: q as string, $options: 'i' } },
          { artist: { $regex: q as string, $options: 'i' } }
        ]
      } as any);
      res.json(dbSongs);
    } else {
      const filtered = songs.filter(s => 
        s.title.toLowerCase().includes(queryStr) || 
        s.artist.toLowerCase().includes(queryStr)
      );
      res.json(filtered);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Playlists
app.post('/api/playlists', authenticateToken, async (req: any, res) => {
  try {
    const { name, description } = req.body;
    const playlistData = { name, description, creator: req.user.id };

    let playlist;
    if (isMongoConnected) {
      playlist = new Playlist(playlistData);
      await playlist.save();
    } else {
      playlist = { _id: Date.now().toString(), ...playlistData, songs: [], createdAt: new Date() };
      playlists.push(playlist);
    }
    res.status(201).json(playlist);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/playlists', authenticateToken, async (req: any, res) => {
  try {
    if (isMongoConnected) {
      const dbPlaylists = await Playlist.find({ creator: req.user.id }).populate('songs');
      res.json(dbPlaylists);
    } else {
      const userPlaylists = playlists.filter(p => p.creator === req.user.id);
      res.json(userPlaylists);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/playlists/:id/songs', authenticateToken, async (req: any, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist || playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.json(playlist);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
