import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../lib/auth';

export default function Header() {
    const role = localStorage.getItem('farmbe_role');

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center pl-4">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold text-xl">FramBe</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {/* Add global nav links here if needed in future */}
                </nav>
                <div className="ml-auto flex items-center space-x-4 pr-4">
                    {role ? (
                        <>
                            <Link to={`/dashboard/${role}`} className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                Login
                            </Link>
                            <Link to="/signup" className="text-sm font-medium font-bold text-primary transition-colors hover:text-primary/80">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
