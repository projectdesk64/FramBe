import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo-upscale.png';
import { Button } from "@/components/ui/button";

export default function Navbar({ variant = 'landing', user, onLogout }) {
    const location = useLocation();
    const roleLabel = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '';

    return (
        <nav className="min-h-[72px] bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="FarmBe"
                            className="h-20 w-auto object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </Link>
                    {variant === 'dashboard' && roleLabel && (
                        <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                            {roleLabel === 'Pg' ? 'PG Owner' : roleLabel} Dashboard
                        </span>
                    )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center space-x-4">
                    {variant === 'landing' && (
                        <>
                            {user ? (
                                <>
                                    <Link to={`/dashboard/${user.role}`}>
                                        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="text-gray-600 hover:text-gray-900 border-gray-200"
                                        onClick={onLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                location.pathname === '/' ? (
                                    <div className="flex items-center gap-4">
                                        <Link to="/login">
                                            <Button variant="ghost" className="text-stone-700 font-medium">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link to="/signup">
                                            <Button className="font-medium">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link to="/signup">
                                            <Button>
                                                Signup
                                            </Button>
                                        </Link>
                                    </>
                                )
                            )}
                        </>
                    )}

                    {variant === 'auth' && (
                        <Link
                            to="/help"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Help
                        </Link>
                    )}

                    {variant === 'dashboard' && (
                        <>
                            {location.pathname === '/dashboard/profile' ? (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/dashboard/${user.role}`}>Dashboard</Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/dashboard/profile">Profile</Link>
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}