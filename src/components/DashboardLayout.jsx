import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../lib/auth';
import Navbar from './ui/Navbar';

// NOTE: Navbar is owned by the layout.
// Do NOT render Navbar inside dashboard pages.

export default function DashboardLayout() {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    const location = useLocation();

    // We can rely on localStorage for the active role since login sets it.
    // For more complex apps, this would come from a Context or Store.
    const userRole = localStorage.getItem('farmbe_role');

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar
                variant="dashboard"
                user={{ role: userRole }}
                onLogout={handleLogout}
            />
            <main className="flex-1 container py-8 px-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
