import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="eta" element={<ETA />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="pg" replace />} />
          <Route path="pg" element={<DashboardPG />} />
          <Route path="farmer" element={<DashboardFarmer />} />
          <Route path="middleman" element={<DashboardMiddleman />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
