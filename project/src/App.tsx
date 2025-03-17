import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Tracks from './components/Tracks';
import Prizes from './components/Prizes';
import Footer from './components/Footer';
import Register from './components/Register';
import Judging from './components/Judging';
import Features from './components/Features';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './lib/supabase';

const ADMIN_EMAIL = 'rohitkumarsingh2021@gmail.com';

function App() {
  const [session, setSession] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      checkIfAdmin(session?.user?.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(!!session);
    checkIfAdmin(session?.user?.email);
  };

  const checkIfAdmin = (email?: string | null) => {
    setIsAdmin(email === ADMIN_EMAIL);
  };

  // Protected route component
  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
    if (!session) return <Navigate to="/auth" />;
    if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
    return <>{children}</>;
  };

  // Home page content
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation onRegisterClick={() => setShowAuth(true)} />
      <Hero onRegisterClick={() => setShowAuth(true)} />
      <Features />
      <Timeline />
      <Tracks />
      <Prizes />
      <Judging />
      <Register />
      <Footer />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/auth" 
          element={
            session ? 
              <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : 
              <Auth onSuccess={() => {
                setShowAuth(false);
                return <Navigate to={isAdmin ? "/admin" : "/dashboard"} />;
              }} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard onLogout={() => setSession(false)} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App