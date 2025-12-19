import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('farmbe_user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user data");
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('farmbe_user');
            localStorage.removeItem('farmbe_role');
            navigate('/');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans antialiased">
            <Navbar variant="dashboard" user={user} onLogout={handleLogout} />

            <main className="">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
