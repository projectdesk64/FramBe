import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tractor, Store, Check } from 'lucide-react';
import { initStore } from "@/lib/demoStore";
import AuthLayout from '../layouts/AuthLayout';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleSignup = (e) => {
        e.preventDefault();

        if (!formData.role) {
            alert("Please select a role.");
            return;
        }

        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        localStorage.setItem('farmbe_user', JSON.stringify(newUser));
        localStorage.setItem('farmbe_role', formData.role);

        initStore();
        navigate(`/dashboard/${formData.role}`);
    };

    const RoleCard = ({ value, label, icon: Icon, description }) => {
        const isSelected = formData.role === value;
        return (
            <div
                onClick={() => setFormData({ ...formData, role: value })}
                className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${isSelected
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                    }`}
            >
                {isSelected && (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                        <Check size={12} strokeWidth={4} />
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                        }`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold transition-colors ${isSelected ? 'text-emerald-900' : 'text-gray-700'
                            }`}>
                            {label}
                        </h3>
                        <p className={`text-[10px] leading-tight transition-colors ${isSelected ? 'text-emerald-700/70' : 'text-gray-500'
                            }`}>
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-500">
                        Choose your role and set up your profile.
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    {/* Role Selection */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-gray-700">I am a...</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <RoleCard
                                value="farmer"
                                label="Farmer"
                                icon={Tractor}
                                description="Sell produce."
                            />
                            <RoleCard
                                value="pg"
                                label="Buyer"
                                icon={Store}
                                description="Source produce."
                            />
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" title="password" className="text-sm font-medium text-gray-700">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        className="h-11 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
                        type="submit"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Footer Links */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
