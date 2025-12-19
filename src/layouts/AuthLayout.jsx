import React from 'react';

import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Navbar variant="auth" />
            <main className="pt-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-full flex items-center justify-center py-12 px-4">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
