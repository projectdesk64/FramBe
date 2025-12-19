import React from 'react';

import Navbar from '../components/ui/Navbar';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            {/* Navbar */}
            <Navbar variant="auth" />

            {/* Main Content */}
            <main className="pt-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-full flex items-center justify-center py-12 px-4">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center sm:justify-between">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} FarmBe. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
