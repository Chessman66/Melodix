import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Login } from './pages/Login';
import { Library } from './pages/Library';

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}
