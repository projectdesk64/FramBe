import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPG from './pages/DashboardPG';
import DashboardFarmer from './pages/DashboardFarmer';
import DashboardMiddleman from './pages/DashboardMiddleman';
import DashboardLayout from './components/DashboardLayout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Payments from './pages/Payments';
import ETA from './pages/ETA';
import Profile from './pages/Profile';
import OrderStatus from './pages/OrderStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
            <Navbar variant="landing" />
            <main className="flex-1">
              <Landing />
            </main>
            <Footer />
          </div>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/order-status" element={<OrderStatus />} />

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="pg" replace />} />
          <Route path="pg" element={<DashboardPG />} />
          <Route path="farmer" element={<DashboardFarmer />} />
          <Route path="middleman" element={<DashboardMiddleman />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="eta" element={<ETA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
