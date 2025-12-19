import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

        // 1. Create User Object
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password, // In a real app, hash this!
            role: formData.role
        };

        // 2. Save to LocalStorage (Simulated Backend)
        localStorage.setItem('farmbe_user', JSON.stringify(newUser));
        localStorage.setItem('farmbe_role', formData.role);

        // 3. Redirect
        navigate(`/dashboard/${formData.role}`);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(10vh-64px)] py-10 px-4 bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to get started with FarmBe
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">I am a...</Label>
                            <select
                                id="role"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="farmer">Farmer (Owner)</option>
                                <option value="middleman">Logistics Manager</option>
                                <option value="pg">PG / Hotel Owner</option>
                            </select>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 mt-4" type="submit">
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
