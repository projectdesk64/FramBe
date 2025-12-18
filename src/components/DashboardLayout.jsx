import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function DashboardLayout() {
    const location = useLocation();
    const path = location.pathname;

    let roleLabel = '';
    if (path.includes('/farmer')) {
        roleLabel = 'Farmer';
    } else if (path.includes('/pg')) {
        roleLabel = 'PG Owner';
    } else if (path.includes('/middleman')) {
        roleLabel = 'Middleman';
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="font-bold text-xl tracking-tight">FramBe</Link>
                        <div className="h-6 w-px bg-border mx-2" />
                        <span className="text-sm font-medium text-muted-foreground">{roleLabel} Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">Logout</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-8 px-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
