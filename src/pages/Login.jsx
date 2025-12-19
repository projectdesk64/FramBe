import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tractor, Building } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setError('');

        // 1. Check persistent DB (New Dynamic Auth)
        const usersDB = JSON.parse(localStorage.getItem('farmbe_users_db') || '[]');
        const dbUser = usersDB.find(u => u.email === email && u.password === password);

        if (dbUser) {
            localStorage.setItem('farmbe_user', JSON.stringify(dbUser));
            localStorage.setItem('farmbe_role', dbUser.role);
            navigate(`/dashboard/${dbUser.role}`);
            return;
        }

        // 2. Check Hardcoded / Demo Config
        const isRamesh = email === "ramesh@greenearth.com" && password === "123456";
        const isSuresh = email === "suresh@saipg.com" && password === "123456";

        if (isRamesh || isSuresh) {
            const role = isRamesh ? 'farmer' : 'pg';
            const demoUser = {
                name: isRamesh ? 'Ramesh Farmer' : 'Suresh PG',
                email: email,
                role: role,
                password: password
            };

            localStorage.setItem('farmbe_user', JSON.stringify(demoUser));
            localStorage.setItem('farmbe_role', role);
            navigate(`/dashboard/${role}`);
            return;
        }

        // 3. Last Resort: Check if the currently valid session matches (Edge case)
        const existingSession = localStorage.getItem('farmbe_user');
        if (existingSession) {
            try {
                const sUser = JSON.parse(existingSession);
                if (sUser.email === email && sUser.password === password) {
                    localStorage.setItem('farmbe_role', sUser.role);
                    navigate(`/dashboard/${sUser.role}`);
                    return;
                }
            } catch (e) { console.error("Session parse error", e); }
        }

        setError("Invalid credentials. Try the Demo buttons!");
    };

    const demoLogin = (role) => {
        if (role === 'farmer') {
            setEmail("ramesh@greenearth.com");
            setPassword("123456");
            setTimeout(() => {
                localStorage.setItem('farmbe_user', JSON.stringify({
                    name: 'Ramesh Farmer',
                    email: "ramesh@greenearth.com",
                    role: 'farmer',
                    password: "123456"
                }));
                localStorage.setItem('farmbe_role', 'farmer');
                navigate('/dashboard/farmer');
            }, 500);
        } else {
            setEmail("suresh@saipg.com");
            setPassword("123456");
            setTimeout(() => {
                localStorage.setItem('farmbe_user', JSON.stringify({
                    name: 'Suresh PG',
                    email: "suresh@saipg.com",
                    role: 'pg',
                    password: "123456"
                }));
                localStorage.setItem('farmbe_role', 'pg');
                navigate('/dashboard/pg');
            }, 500);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-500">
                        Login to manage your farm or orders.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" title="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500">
                                Forgot password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        className="h-11 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
                        type="submit"
                    >
                        Sign In
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-medium">
                            Demo Shortcuts
                        </span>
                    </div>
                </div>

                {/* Demo Buttons Section */}
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="h-10 text-sm border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        onClick={() => demoLogin('farmer')}
                    >
                        <Tractor size={16} className="text-emerald-600" />
                        <span>Farmer</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 text-sm border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        onClick={() => demoLogin('pg')}
                    >
                        <Building size={16} className="text-blue-600" />
                        <span>Buyer</span>
                    </Button>
                </div>

                {/* Signup Link */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-500">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
