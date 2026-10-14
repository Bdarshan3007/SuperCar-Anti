/* ==========================================================================
   APP ROOT COMPONENT (UPGRADED WITH ANIMATE PRESENCE PAGE TRANSITIONS)
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CarProvider } from './context/CarContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Configurator from './pages/Configurator';
import Compare from './pages/Compare';
import Collections from './pages/Collections';
import Experience from './pages/Experience';
import Journal from './pages/Journal';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Smooth Scroll to Top on Route Change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/cars" element={<PageTransition><Cars /></PageTransition>} />
        <Route path="/cars/:id" element={<PageTransition><CarDetails /></PageTransition>} />
        <Route path="/configurator" element={<PageTransition><Configurator /></PageTransition>} />
        <Route path="/configurator/:id" element={<PageTransition><Configurator /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
        <Route path="/collections" element={<PageTransition><Collections /></PageTransition>} />
        <Route path="/experience" element={<PageTransition><Experience /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <Router>
      <CarProvider>
        <FavoriteProvider>
          <AuthProvider>
            {/* Initial Cinematic Calibration Screen */}
            <LoadingScreen onComplete={() => setLoadingDone(true)} />

            {/* Custom Precision Dual Cursor */}
            <CustomCursor />

            {/* Auto Scroll Reset */}
            <ScrollToTop />

            {/* App Layout */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#06070a' }}>
              <Navbar />

              <main style={{ flex: 1 }}>
                <AnimatedRoutes />
              </main>

              <Footer />
            </div>
          </AuthProvider>
        </FavoriteProvider>
      </CarProvider>
    </Router>
  );
}
