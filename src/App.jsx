import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardFarmer from './pages/DashboardFarmer';
import DashboardPG from './pages/DashboardPG';
import DashboardLayout from './layouts/DashboardLayout';
import OrderStatus from './pages/OrderStatus';
import Profile from './pages/Profile';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

// Simple Placeholder for "Coming Soon" pages
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-4xl font-bold text-stone-800 mb-4">{title}</h1>
    <p className="text-lg text-stone-600">We are working hard to bring you this feature. Stay tuned!</p>
  </div>
);

// Layout for public pages that need the standard Navbar
const AppLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('farmbe_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('farmbe_user');
    localStorage.removeItem('farmbe_role');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background font-sans text-stone-900">
      <Navbar variant="landing" user={user} onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* LANDING PAGE IS NOW HERE TO SHARE LAYOUT */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<PlaceholderPage title="Our Mission" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="/farmers" element={<PlaceholderPage title="Our Farmers" />} />
          <Route path="/requests" element={<PlaceholderPage title="Marketplace" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        </Route>

        {/* Dashboards - Wrapped in Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/farmer" element={<DashboardFarmer />} />
          <Route path="/dashboard/pg" element={<DashboardPG />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/order-status" element={<OrderStatus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;