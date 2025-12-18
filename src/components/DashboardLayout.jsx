import React from 'react';
import { Outlet, useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import { logout, isAuthenticated } from '../lib/auth';

export default function DashboardLayout() {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    const location = useLocation();
    const path = location.pathname;

    const userRole = localStorage.getItem('farmbe_role');

    let roleLabel = '';
    if (path.includes('/farmer') || userRole === 'farmer') {
        roleLabel = 'Farmer';
    } else if (path.includes('/pg') || userRole === 'pg') {
        roleLabel = 'PG Owner';
    } else if (path.includes('/middleman') || userRole === 'middleman') {
        roleLabel = 'Middleman';
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="font-bold text-xl tracking-tight text-primary">FramBe</Link>
                        <div className="h-6 w-px bg-border mx-2" />
                        <span className="text-sm font-medium text-muted-foreground">{roleLabel} Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard/profile">Profile</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-8 px-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
